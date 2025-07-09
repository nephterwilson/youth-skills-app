








document.addEventListener("DOMContentLoaded", () => {
  const skillsList = document.getElementById("skills-list");
  const moduleTitle = document.getElementById("module-title");
  const moduleDesc = document.getElementById("module-desc");
  const lessonsList = document.getElementById("lessons-list");

  // INDEX PAGE: Load all skills
  if (skillsList) {
    fetch("data/youth_skills_modules.json")
      .then(res => res.json())
      .then(data => {
        data.modules.forEach((mod, index) => {
          const btn = document.createElement("a");
          btn.href = `module.html?module=${index}`;
          btn.className = "block w-full bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600 text-center mb-2";
          btn.innerText = mod.title;
          skillsList.appendChild(btn);
        });
      });
  }

  

  // MODULE PAGE: Load lessons for selected module
  if (moduleTitle && moduleDesc && lessonsList) {
    const params = new URLSearchParams(window.location.search);
    const moduleIndex = parseInt(params.get("module"));

    if (!isNaN(moduleIndex)) {
      fetch("data/youth_skills_modules.json")
        .then(res => res.json())
        .then(data => {
          const module = data.modules[moduleIndex];
          if (!module) return;

          moduleTitle.innerText = module.title;
          moduleDesc.innerText = module.description;

          module.lessons.forEach((lesson, i) => {
            const li = document.createElement("li");
            li.className = "bg-blue-50 p-3 rounded-xl shadow hover:bg-blue-100 cursor-pointer";
            li.innerText = lesson.title;
            li.onclick = () => {
              window.location.href = `lesson.html?module=${moduleIndex}&lesson=${i}`;
            };
            lessonsList.appendChild(li);
          });
        })
        .catch(err => {
          lessonsList.innerHTML = `<p class='text-red-500'>Error loading lessons.</p>`;
          console.error(err);
        });
    }
  }

  // LESSON PAGE: Load lesson content
  const lessonTitle = document.getElementById("lesson-title");
  const lessonContent = document.getElementById("lesson-content");
  const lessonPoints = document.getElementById("lesson-points");
  const lessonExample = document.getElementById("lesson-example");

  if (lessonTitle && lessonContent && lessonPoints && lessonExample) {
    const params = new URLSearchParams(window.location.search);
    const moduleIndex = parseInt(params.get("module"));
    const lessonIndex = parseInt(params.get("lesson"));

    if (!isNaN(moduleIndex) && !isNaN(lessonIndex)) {
      fetch("data/youth_skills_modules.json")
        .then(res => res.json())
        .then(data => {
          const module = data.modules[moduleIndex];
          if (!module) throw new Error("Module not found");

          const lesson = module.lessons[lessonIndex];
          if (!lesson) throw new Error("Lesson not found");

          lessonTitle.innerText = lesson.title;
          lessonContent.innerText = lesson.content;

          // Clear previous points
          lessonPoints.innerHTML = "";
          lesson.key_points.forEach(point => {
            const li = document.createElement("li");
            li.innerText = point;
            lessonPoints.appendChild(li);
          });

          lessonExample.innerText = "📌 Local Example: " + lesson.local_example;

          // Update Back and Quiz links
          const backLink = document.querySelector('a[href="module.html"]');
          if (backLink) backLink.href = `module.html?module=${moduleIndex}`;

          const quizLink = document.querySelector('a[href="quiz.html"]');
          if (quizLink) quizLink.href = `quiz.html?module=${moduleIndex}`;
        })
        .catch(err => {
          lessonTitle.innerText = "Error loading lesson";
          lessonContent.innerText = err.message;
          lessonPoints.innerHTML = "";
          lessonExample.innerText = "";
          console.error(err);
        });
    }
  }
});

