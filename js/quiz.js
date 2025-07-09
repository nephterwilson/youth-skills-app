



document.addEventListener("DOMContentLoaded", () => {
  const quizContainer = document.getElementById("quiz-container");
  if (!quizContainer) return;

  const params = new URLSearchParams(window.location.search);
  const moduleIndex = parseInt(params.get("module"));

  if (isNaN(moduleIndex)) {
    quizContainer.innerHTML = "<p class='text-red-500'>No module selected for quiz.</p>";
    return;
  }

  fetch("data/youth_skills_modules.json")
    .then(res => res.json())
    .then(data => {
      const module = data.modules[moduleIndex];
      if (!module || !module.quiz || module.quiz.length === 0) {
        quizContainer.innerHTML = "<p class='text-gray-600'>No quiz available for this module.</p>";
        return;
      }

      const quizData = module.quiz;
      let currentQuestionIndex = 0;

      function loadQuestion(index) {
        const q = quizData[index];
        quizContainer.innerHTML = `
          <h3 class="text-lg font-semibold mb-4">${index + 1}. ${q.question}</h3>
          <ul class="space-y-2">
            ${q.options.map(opt => `
              <li>
                <button class="w-full bg-gray-100 p-3 rounded hover:bg-gray-200">${opt}</button>
              </li>`).join('')}
          </ul>
        `;

        const buttons = quizContainer.querySelectorAll("button");
        buttons.forEach(btn => {
          btn.addEventListener("click", () => {
            if (btn.innerText === q.answer) {
              alert("✅ Correct!");
            } else {
              alert("❌ Wrong answer!");
            }

            currentQuestionIndex++;
            if (currentQuestionIndex < quizData.length) {
              loadQuestion(currentQuestionIndex);
            } else {
              quizContainer.innerHTML = `<h3 class="text-xl font-bold text-green-600">🎉 Quiz Completed!</h3>`;
            }
          });
        });
      }

      loadQuestion(currentQuestionIndex);
    })
    .catch(err => {
      quizContainer.innerHTML = "<p class='text-red-500'>Failed to load quiz.</p>";
      console.error(err);
    });
});
