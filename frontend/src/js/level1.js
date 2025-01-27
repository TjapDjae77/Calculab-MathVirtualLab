document.addEventListener('DOMContentLoaded', () => {
    const goBackButton = document.querySelector('img[alt="Back Button"]');
    const goBackPopup = document.getElementById('goBackPopup');
    const cancelGoBack = document.getElementById('cancelGoBack');
    const confirmGoBack = document.getElementById('confirmGoBack');
    const draggableItems = document.querySelectorAll('.draggable');
    const dropArea = document.querySelector('.drop-area');
    const dropText = dropArea.querySelector('.drop-text');
    const playButton = document.getElementById('playButton');
    const baseFunction = document.getElementById("base-function");
    const inputFunction = document.getElementById('input_function');
    const functionMachine = document.querySelector(".function-question");
    const outputComponent = document.querySelector(".output-image");
    const progressBar = document.querySelector(".progress-bar");
    const lifeIcons = document.querySelectorAll(".life-icon");
    const popupModal = document.getElementById("popupModal");
    const popupTitle = document.getElementById("popupTitle");
    const popupMessage = document.getElementById("popupMessage");
    const popupButton = document.getElementById("popupButton");
    
    let questions = [];
    let currentQuestionIndex = 0;
    let livesRemaining = 3;
    let isGameOver = false;
    let expectedFunction = [];
    let expectedMaterial = "";
    let question = "";

    // Fetch questions from the API
    async function fetchQuestions() {
        const response = await fetch('https://calculab-backend.up.railway.app/api/questions/');
        const data = await response.json();
        const level1Questions = data.filter(question => question.level === 1);

        // Fisher-Yates Shuffle to randomize the questions
        function fisherYatesShuffle(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1)); // Pilih indeks acak
                [array[i], array[j]] = [array[j], array[i]];   // Tukar elemen
            }
            return array;
        }

        // Shuffle and select 3 questions
        questions = fisherYatesShuffle(level1Questions).slice(0, 3);
        console.log('Questions');
        console.log(questions);

        // Muat soal pertama kali
        loadQuestion();
    }

    fetchQuestions();

    function loadQuestion() {
        question = questions[currentQuestionIndex];
        if (!question) return;
        functionMachine.innerHTML = `${question.premise1}<br><br>${question.premise2}`;
        outputComponent.src = `assets/images/${question.output_material}.svg`;
        expectedFunction = question.input_function_checker;
        baseFunction.innerHTML = `${question.base_function} =`;
        expectedMaterial = `${question.material_input_checker}.png`;
        inputFunction.value = ""; // Reset input function
        dropText.style.display = ""; // Tampilkan ulang teks drop area
        const existingImage = dropArea.querySelector("img");
        if (existingImage) existingImage.remove(); // Hapus gambar sebelumnya
    }

    function showScorePopup(score) {
        const scorePopup = document.getElementById('scorePopup');
        const finalScore = document.getElementById('finalScore');
        const scoreClose = document.getElementById('scoreClose');
    
        // Set skor dan tampilkan pop-up
        finalScore.textContent = score;
        scorePopup.classList.remove('hidden');
    
        // Tutup pop-up
        scoreClose.addEventListener('click', () => {
            scorePopup.classList.add('hidden');
            window.location.href = 'roadmap.html'; // Redirect ke roadmap setelah melanjutkan
        });
    }

    function showPopup(title, message, callback, type = "info") {
        popupTitle.textContent = title;
        popupMessage.textContent = message;
        popupModal.querySelector("div").classList.remove("bg-green-200", "bg-red-200", "bg-blue-200");
        if (type === "success") {
            popupModal.querySelector("div").classList.add("bg-green-200");
        } else if (type === "error") {
            popupModal.querySelector("div").classList.add("bg-red-200");
        }

        popupModal.classList.remove("hidden");

        popupButton.onclick = () => {
            popupModal.classList.add("hidden");
            if (callback) callback();
        };
    }

    function handleWrongAnswer() {
        livesRemaining -= 1;

        // Update nyawa pada UI
        if (livesRemaining >= 0) {
            lifeIcons[livesRemaining].src = "assets/images/Empty_Heart.svg";
        }

        if (livesRemaining === 0) {
            isGameOver = true;
            showPopup("Game Over", "You ran out of lives. Better luck next time!", () => {
                // Redirect hanya setelah klik tombol Continue
                window.location.href = "roadmap.html";
            });
        } else {
            // Nyawa masih tersisa
            showPopup("Incorrect!", "Oops! That's not the right answer. Try again.", null, "error");
        }
    }

    function validateAnswer() {
        if (isGameOver) return;

        const materialImage = dropArea.querySelector("img");
        const materialSrc = materialImage ? materialImage.src.split("/").pop() : null;
        const inputFunctionValue = inputFunction.value.trim();

        const isFunctionCorrect = expectedFunction.includes(inputFunctionValue);

        if (materialSrc === expectedMaterial && isFunctionCorrect) {
            currentQuestionIndex++;

            // Perbarui progress bar
            const progressPercentage =
                ((currentQuestionIndex / 3) * 100).toFixed(2);
            progressBar.style.width = `${progressPercentage}%`;

            if (currentQuestionIndex < 3) {
                showPopup("Correct!", "Great job! On to the next question.", () => {
                    loadQuestion();
                }, "success");
            } else {
                const score = 100 * livesRemaining;
                updateProgressOnServer(1, score);
                showScorePopup(score);
            }
        } else {
            handleWrongAnswer();
            
        }
    }

    playButton.addEventListener("click", () => {
        validateAnswer();
    });

    goBackButton.addEventListener('click', () => {
        goBackPopup.classList.remove('hidden');
    });

    // Tutup pop-up jika klik tombol Cancel
    cancelGoBack.addEventListener('click', () => {
        goBackPopup.classList.add('hidden');
    });

    // Reset state level dan redirect ke roadmap saat tombol Leave diklik
    confirmGoBack.addEventListener('click', () => {
        resetLevelState(); // Reset state level
        window.location.href = 'roadmap.html'; // Redirect ke halaman roadmap
    });

    function resetLevelState() {
        // Reset nyawa
        const lifeIcons = document.querySelectorAll('.life-icon');
        lifeIcons.forEach(icon => {
            icon.src = 'assets/images/Full_Heart.svg';
        });

        // Reset input function
        const inputFunction = document.getElementById('input_function');
        inputFunction.value = '';

        // Reset progress bar
        const progressBar = document.querySelector('.bg-blue-500');
        progressBar.style.width = '0%';

        // Reset drop area
        const dropArea = document.querySelector('.drop-area');
        const dropText = dropArea.querySelector('.drop-text');
        const existingImage = dropArea.querySelector('img');
        if (existingImage) existingImage.remove();
        if (dropText) dropText.style.display = 'block';
    }

    function updateProgressOnServer(level_number, score) {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No access token found');
            return;
        }
    
        fetch(`https://calculab-backend.up.railway.app/api/levels/complete/${level_number}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ score }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update progress');
            }
            return response.json();
        })
        .then(data => {
            console.log('Progress updated successfully:', data);
        })
        .catch(error => {
            console.error('Error updating progress:', error);
        });
    }
    

    // Fungsi untuk memeriksa apakah kedua kondisi terpenuhi
    function validateInputs() {
        const isMaterialInputValid = !dropText || dropText.style.display === 'none'; // Valid jika teks default disembunyikan
        const isFunctionValid = inputFunction.value.trim() !== ''; // Valid jika fungsi tidak kosong

        if (isMaterialInputValid && isFunctionValid) {
            playButton.disabled = false;
            playButton.classList.remove('cursor-not-allowed', 'bg-gray-400');
            playButton.classList.add('bg-pink-600', 'hover:bg-pink-700')
        } else {
            playButton.disabled = true;
            playButton.classList.add('cursor-not-allowed', 'bg-gray-400');
            playButton.classList.remove('bg-pink-600', 'hover:bg-pink-700')
        }
    }

    const observer = new MutationObserver(() => {
        validateInputs();
    });

    observer.observe(dropArea, { childList: true, subtree: false });

    // Event listener untuk Input Function
    inputFunction.addEventListener('input', () => {
        validateInputs();
    });

    draggableItems.forEach(item => {
        item.addEventListener('dragstart', (e) => {
            const imgElement = item.querySelector('img');
            if (imgElement) {
                e.dataTransfer.setData('text', imgElement.src); // Kirim `src` gambar ke event `drop`
                console.log('Gambar yang di-drag:', imgElement.src);
            }
        });
    });

    // Menambahkan event listener untuk area drop
    dropArea.addEventListener('dragover', (e) => {
        e.preventDefault(); // Mengizinkan drop
    });

    dropArea.addEventListener('drop', (e) => {
        e.preventDefault();
        const imgSrc = e.dataTransfer.getData('text'); // Ambil `src` gambar dari event `dragstart`
    
        if (imgSrc) {
            // Sembunyikan teks "Drop the material here"
            if (dropText) {
                dropText.style.display = 'none';
            }
    
            // Periksa jika ada gambar sebelumnya dan ganti dengan yang baru
            let existingImage = dropArea.querySelector('img');
            if (existingImage) {
                existingImage.remove();
            }
    
            // Tambahkan elemen gambar baru ke drop area
            const newItem = document.createElement('img');
            newItem.src = imgSrc;
            newItem.classList.add('object-contain');
            newItem.style.width = '80px';
            newItem.style.height = '80px';
            newItem.style.pointerEvents = 'none'; // Mencegah drag ulang
            dropArea.appendChild(newItem);
            console.log('Gambar baru berhasil ditambahkan ke dropArea');
        }
    });
    
});