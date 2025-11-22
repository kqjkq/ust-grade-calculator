// Utility functions for grade calculations

/**
 * Calculate the current grade based on completed components
 * @param {Array} components - Array of grade components with score and weight
 * @returns {Object} - Object containing current grade percentage and letter grade
 */
function calculateCurrentGrade(components) {
    if (!components || components.length === 0) {
        return { percentage: 0, letter: 'N/A' };
    }

    let totalWeight = 0;
    let weightedSum = 0;
    let hasScores = false;

    components.forEach(component => {
        if (component.score !== undefined && component.score !== '') {
            const score = parseFloat(component.score);
            if (!isNaN(score)) {
                weightedSum += (score * component.weight) / 100;
                totalWeight += component.weight;
                hasScores = true;
            }
        }
    });

    if (!hasScores || totalWeight === 0) {
        return { percentage: 0, letter: 'N/A' };
    }

    const percentage = (weightedSum / totalWeight) * 100;
    return {
        percentage: parseFloat(percentage.toFixed(2)),
        letter: getGradeLetter(percentage)
    };
}

/**
 * Calculate the required grade needed on remaining components to reach target grade
 * @param {number} targetGrade - Target grade percentage (0-100)
 * @param {Array} components - Array of all grade components
 * @returns {Object} - Object containing required grade and remaining components
 */
function calculateRequiredGrade(targetGrade, components) {
    if (!components || components.length === 0) {
        return { requiredGrade: 0, remainingWeight: 0 };
    }

    let completedWeight = 0;
    let completedScore = 0;
    let remainingWeight = 0;

    // Calculate completed and remaining weights/scores
    components.forEach(component => {
        const weight = component.weight;
        
        if (component.score !== undefined && component.score !== '') {
            const score = parseFloat(component.score);
            if (!isNaN(score)) {
                completedScore += (score * weight) / 100;
                completedWeight += weight;
            } else {
                remainingWeight += weight;
            }
        } else {
            remainingWeight += weight;
        }
    });

    // If all components are completed
    if (remainingWeight === 0) {
        const currentGrade = (completedScore / completedWeight) * 100;
        return {
            requiredGrade: 0,
            remainingWeight: 0,
            isAchievable: currentGrade >= targetGrade,
            currentGrade: parseFloat(currentGrade.toFixed(2))
        };
    }

    // Calculate required grade on remaining components
    const requiredScore = (targetGrade - completedScore) / (remainingWeight / 100);
    
    return {
        requiredGrade: parseFloat(Math.max(0, requiredScore).toFixed(2)),
        remainingWeight: remainingWeight,
        isAchievable: requiredScore <= 100,
        currentGrade: completedWeight > 0 ? parseFloat(((completedScore / completedWeight) * 100).toFixed(2)) : 0
    };
}

/**
 * Generate a study plan based on grade components
 * @param {Array} components - Array of grade components
 * @param {number} targetGrade - Target grade percentage
 * @returns {Array} - Sorted array of study recommendations
 */
function generateStudyPlan(components, targetGrade) {
    if (!components || components.length === 0) {
        return [];
    }

    // Calculate priority score for each component
    const componentsWithPriority = components.map(component => {
        const score = component.score !== undefined && component.score !== '' ? 
                     parseFloat(component.score) : 0;
        const isCompleted = component.score !== undefined && component.score !== '' && !isNaN(score);
        
        // Priority is based on weight, difficulty, and how far below target
        let priority = 0;
        if (!isCompleted) {
            // Higher weight and difficulty = higher priority
            priority = component.weight * (component.difficulty || 1);
            
            // If we have a target grade, prioritize components where we're below target
            if (targetGrade > 0 && score < targetGrade) {
                const gap = targetGrade - score;
                priority *= (1 + gap / 20); // Scale priority based on how far below target
            }
        }
        
        return {
            ...component,
            isCompleted,
            priority,
            currentScore: isNaN(score) ? 0 : score
        };
    });

    // Sort by priority (descending)
    return componentsWithPriority
        .filter(comp => !comp.isCompleted) // Only include incomplete components
        .sort((a, b) => b.priority - a.priority)
        .slice(0, 3); // Top 3 recommendations
}

/**
 * Calculate the final grade based on all components
 * @param {Array} components - Array of grade components with score and weight
 * @returns {Object} - Final grade percentage and letter grade
 */
function calculateFinalGrade(components) {
    if (!components || components.length === 0) {
        return { percentage: 0, letter: 'N/A' };
    }

    let totalWeight = 0;
    let weightedSum = 0;
    let hasScores = false;

    components.forEach(component => {
        const weight = component.weight;
        let score = 0;
        
        if (component.score !== undefined && component.score !== '') {
            const parsedScore = parseFloat(component.score);
            if (!isNaN(parsedScore)) {
                score = parsedScore;
                hasScores = true;
            }
        }
        
        // If no score, assume 0 for final grade calculation
        weightedSum += (score * weight) / 100;
        totalWeight += weight;
    });

    if (!hasScores || totalWeight === 0) {
        return { percentage: 0, letter: 'N/A' };
    }

    const percentage = (weightedSum / (totalWeight / 100));
    return {
        percentage: parseFloat(percentage.toFixed(2)),
        letter: getGradeLetter(percentage)
    };
}

// Export all calculation functions
window.GradeCalculator = {
    calculateCurrentGrade,
    calculateRequiredGrade,
    generateStudyPlan,
    calculateFinalGrade,
    getGradeLetter,
    getGradePoints
};
