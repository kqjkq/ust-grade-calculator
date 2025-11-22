document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const courseSelect = document.getElementById('course');
    const professorSelect = document.getElementById('professor');
    const targetGradeSelect = document.getElementById('target-grade');
    const gradeComponents = document.getElementById('grade-components');
    const calculateBtn = document.getElementById('calculate-btn');
    const currentGradeEl = document.getElementById('current-grade');
    const targetDisplayEl = document.getElementById('target-display');
    const neededGradeEl = document.getElementById('needed-grade');
    const studyPlanEl = document.getElementById('study-plan');

    // State
    let currentCourse = null;
    let currentProfessor = null;
    let gradeComponentsData = [];

    // Event Listeners
    courseSelect.addEventListener('change', handleCourseChange);
    professorSelect.addEventListener('change', handleProfessorChange);
    targetGradeSelect.addEventListener('change', updateResults);
    calculateBtn.addEventListener('click', calculateGrades);

    // Initialize the app
    initialize();

    function initialize() {
        // Populate course select
        Object.entries(coursesData).forEach(([id, course]) => {
            const option = document.createElement('option');
            option.value = id;
            option.textContent = course.name;
            courseSelect.appendChild(option);
        });

        // Set default target grade to A (85%)
        targetGradeSelect.value = '85';
    }

    function handleCourseChange() {
        const courseId = courseSelect.value;
        
        if (!courseId) {
            professorSelect.disabled = true;
            professorSelect.innerHTML = '<option value="">Select a professor</option>';
            updateGradeComponents([]);
            return;
        }

        currentCourse = coursesData[courseId];
        populateProfessors(currentCourse.professors);
    }

    function populateProfessors(professors) {
        professorSelect.innerHTML = '<option value="">Select a professor</option>';
        
        professors.forEach(professor => {
            const option = document.createElement('option');
            option.value = professor.id;
            option.textContent = professor.name;
            professorSelect.appendChild(option);
        });

        professorSelect.disabled = false;
        
        // If there's only one professor, select it automatically
        if (professors.length === 1) {
            professorSelect.value = professors[0].id;
            handleProfessorChange();
        }
    }

    function handleProfessorChange() {
        const professorId = professorSelect.value;
        
        if (!professorId || !currentCourse) {
            updateGradeComponents([]);
            return;
        }

        const professor = currentCourse.professors.find(p => p.id === professorId);
        if (professor) {
            currentProfessor = professor;
            updateGradeComponents(professor.gradeComponents);
            calculateBtn.disabled = false;
        }
    }

    function updateGradeComponents(components) {
        gradeComponentsData = [...components];
        gradeComponents.innerHTML = '';

        if (components.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.innerHTML = `
                <i class="fas fa-book-open"></i>
                <p>Select a course and professor to see grade components</p>
            `;
            gradeComponents.appendChild(emptyState);
            return;
        }

        components.forEach((component, index) => {
            const componentEl = document.createElement('div');
            componentEl.className = 'grade-item';
            componentEl.dataset.index = index;
            
            componentEl.innerHTML = `
                <div class="grade-item-header">
                    <span class="grade-item-title">${component.name}</span>
                    <span class="grade-item-weight">${component.weight}% of final grade</span>
                </div>
                <div class="grade-inputs">
                    <div class="input-group">
                        <label>Your Score (%)</label>
                        <input type="number" min="0" max="100" step="0.01" 
                               class="form-control score-input" 
                               placeholder="Enter score" 
                               data-index="${index}">
                    </div>
                    <div class="input-group">
                        <label>Target Score (%)</label>
                        <input type="number" min="0" max="100" step="0.01" 
                               class="form-control target-input" 
                               placeholder="Target" 
                               data-index="${index}">
                    </div>
                </div>
            `;

            // Add event listeners for real-time updates
            const scoreInput = componentEl.querySelector('.score-input');
            const targetInput = componentEl.querySelector('.target-input');
            
            scoreInput.addEventListener('input', handleScoreChange);
            targetInput.addEventListener('input', handleTargetChange);

            gradeComponents.appendChild(componentEl);
        });
    }

    function handleScoreChange(e) {
        const index = parseInt(e.target.dataset.index);
        const value = e.target.value.trim();
        
        if (value === '') {
            delete gradeComponentsData[index].score;
        } else {
            const score = parseFloat(value);
            if (!isNaN(score)) {
                gradeComponentsData[index].score = Math.min(100, Math.max(0, score));
                e.target.value = gradeComponentsData[index].score;
            }
        }
        
        updateResults();
    }

    function handleTargetChange(e) {
        const index = parseInt(e.target.dataset.index);
        const value = e.target.value.trim();
        
        if (value === '') {
            delete gradeComponentsData[index].target;
        } else {
            const target = parseFloat(value);
            if (!isNaN(target)) {
                gradeComponentsData[index].target = Math.min(100, Math.max(0, target));
                e.target.value = gradeComponentsData[index].target;
            }
        }
        
        updateResults();
    }

    function calculateGrades() {
        updateResults();
    }

    function updateResults() {
        if (!currentProfessor || gradeComponentsData.length === 0) {
            return;
        }

        const targetGrade = parseFloat(targetGradeSelect.value);
        
        // Calculate current grade
        const currentGrade = GradeCalculator.calculateCurrentGrade(gradeComponentsData);
        
        // Calculate required grade on remaining components
        const requiredGrade = GradeCalculator.calculateRequiredGrade(targetGrade, gradeComponentsData);
        
        // Update UI
        updateGradeResults(currentGrade, targetGrade, requiredGrade);
        updateStudyPlan(targetGrade);
    }

    function updateGradeResults(currentGrade, targetGrade, requiredGrade) {
        // Update current grade display
        if (currentGrade.letter !== 'N/A') {
            currentGradeEl.textContent = `${currentGrade.percentage}% (${currentGrade.letter})`;
            currentGradeEl.className = getGradeClass(currentGrade.percentage);
        } else {
            currentGradeEl.textContent = 'Enter your scores to see current grade';
            currentGradeEl.className = '';
        }

        // Update target grade display
        targetDisplayEl.textContent = `${targetGrade}% (${getGradeLetter(targetGrade)})`;
        
        // Update needed grade display
        if (requiredGrade.remainingWeight > 0) {
            const gradeLetter = getGradeLetter(requiredGrade.requiredGrade);
            neededGradeEl.textContent = `${requiredGrade.requiredGrade}% (${gradeLetter})`;
            neededGradeEl.className = getGradeClass(requiredGrade.requiredGrade);
            
            if (!requiredGrade.isAchievable) {
                neededGradeEl.textContent += ' (Not achievable)';
                neededGradeEl.classList.add('text-danger');
            }
        } else {
            neededGradeEl.textContent = 'All components completed';
            neededGradeEl.className = '';
        }
    }

    function updateStudyPlan(targetGrade) {
        studyPlanEl.innerHTML = '';
        
        if (gradeComponentsData.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.innerHTML = `
                <i class="fas fa-lightbulb"></i>
                <p>Enter your grades to see personalized study recommendations</p>
            `;
            studyPlanEl.appendChild(emptyState);
            return;
        }

        // Generate study plan
        const studyItems = GradeCalculator.generateStudyPlan(gradeComponentsData, targetGrade);
        
        if (studyItems.length === 0) {
            const allComplete = document.createElement('div');
            allComplete.className = 'empty-state';
            allComplete.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <p>All components completed! Great job!</p>
            `;
            studyPlanEl.appendChild(allComplete);
            return;
        }

        // Create study plan items
        studyItems.forEach((item, index) => {
            const priorityClass = getPriorityClass(index);
            const difficultyStars = '★'.repeat(item.difficulty) + '☆'.repeat(5 - item.difficulty);
            
            const studyItem = document.createElement('div');
            studyItem.className = `study-plan-item ${priorityClass}`;
            
            studyItem.innerHTML = `
                <div class="study-plan-icon">
                    <i class="fas fa-${getPriorityIcon(index)}"></i>
                </div>
                <div class="study-plan-content">
                    <h4>${item.name}</h4>
                    <p>${item.weight}% of grade • Difficulty: ${difficultyStars}</p>
                    ${item.currentScore > 0 ? 
                        `<p>Current: ${item.currentScore}% (Aim for: ${item.target || targetGrade}%)</p>` : 
                        `<p>Not yet started • Target: ${item.target || targetGrade}%</p>`
                    }
                </div>
            `;
            
            studyPlanEl.appendChild(studyItem);
        });
    }

    // Helper functions
    function getGradeClass(percentage) {
        if (percentage >= 85) return 'text-success';
        if (percentage >= 70) return 'text-warning';
        return 'text-danger';
    }

    function getPriorityClass(index) {
        const priorities = ['high', 'medium', 'low'];
        return priorities[index] || '';
    }

    function getPriorityIcon(index) {
        const icons = ['exclamation-circle', 'exclamation-triangle', 'info-circle'];
        return icons[index] || 'info-circle';
    }

    // Make these functions globally available for calculations.js
    window.getGradeLetter = function(percentage) {
        for (const [grade, range] of Object.entries(gradeScale)) {
            if (percentage >= range.min && percentage <= range.max) {
                return grade;
            }
        }
        return 'F';
    };

    window.getGradePoints = function(percentage) {
        return gradeScale[getGradeLetter(percentage)].points;
    };
});
