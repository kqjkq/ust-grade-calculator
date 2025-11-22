// Mock data for courses and their grade components
const coursesData = {
    'cs101': {
        name: 'CS 101 - Introduction to Computer Science',
        professors: [
            {
                id: 'smith',
                name: 'Dr. Smith',
                gradeComponents: [
                    { name: 'Assignments', weight: 20, difficulty: 3 },
                    { name: 'Midterm Exam', weight: 30, difficulty: 4 },
                    { name: 'Final Exam', weight: 40, difficulty: 5 },
                    { name: 'Participation', weight: 10, difficulty: 1 }
                ]
            },
            {
                id: 'johnson',
                name: 'Prof. Johnson',
                gradeComponents: [
                    { name: 'Labs', weight: 25, difficulty: 3 },
                    { name: 'Projects', weight: 35, difficulty: 4 },
                    { name: 'Midterm', weight: 20, difficulty: 4 },
                    { name: 'Final Exam', weight: 20, difficulty: 5 }
                ]
            }
        ]
    },
    'math201': {
        name: 'MATH 201 - Linear Algebra',
        professors: [
            {
                id: 'brown',
                name: 'Dr. Brown',
                gradeComponents: [
                    { name: 'Homework', weight: 25, difficulty: 4 },
                    { name: 'Quizzes', weight: 15, difficulty: 3 },
                    { name: 'Midterm 1', weight: 20, difficulty: 4 },
                    { name: 'Midterm 2', weight: 20, difficulty: 4 },
                    { name: 'Final Exam', weight: 20, difficulty: 5 }
                ]
            }
        ]
    },
    'phys101': {
        name: 'PHYS 101 - Physics I',
        professors: [
            {
                id: 'wilson',
                name: 'Dr. Wilson',
                gradeComponents: [
                    { name: 'Labs', weight: 20, difficulty: 3 },
                    { name: 'Homework', weight: 20, difficulty: 3 },
                    { name: 'Midterm 1', weight: 15, difficulty: 4 },
                    { name: 'Midterm 2', weight: 15, difficulty: 4 },
                    { name: 'Final Exam', weight: 30, difficulty: 5 }
                ]
            },
            {
                id: 'chen',
                name: 'Prof. Chen',
                gradeComponents: [
                    { name: 'Problem Sets', weight: 30, difficulty: 4 },
                    { name: 'Lab Reports', weight: 20, difficulty: 3 },
                    { name: 'Midterm Exam', weight: 20, difficulty: 4 },
                    { name: 'Final Project', weight: 20, difficulty: 5 },
                    { name: 'Class Participation', weight: 10, difficulty: 2 }
                ]
            }
        ]
    }
};

// Grade scale mapping
const gradeScale = {
    'A+': { min: 90, max: 100, points: 4.0 },
    'A': { min: 85, max: 89, points: 4.0 },
    'A-': { min: 80, max: 84, points: 3.7 },
    'B+': { min: 77, max: 79, points: 3.3 },
    'B': { min: 73, max: 76, points: 3.0 },
    'B-': { min: 70, max: 72, points: 2.7 },
    'C+': { min: 67, max: 69, points: 2.3 },
    'C': { min: 63, max: 66, points: 2.0 },
    'C-': { min: 60, max: 62, points: 1.7 },
    'D': { min: 50, max: 59, points: 1.0 },
    'F': { min: 0, max: 49, points: 0.0 }
};

// Function to get grade letter from percentage
function getGradeLetter(percentage) {
    for (const [grade, range] of Object.entries(gradeScale)) {
        if (percentage >= range.min && percentage <= range.max) {
            return grade;
        }
    }
    return 'F';
}

// Function to get grade points from percentage
function getGradePoints(percentage) {
    return gradeScale[getGradeLetter(percentage)].points;
}
