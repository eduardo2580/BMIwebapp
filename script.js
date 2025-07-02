document.addEventListener('DOMContentLoaded', () => {
    const calculateButton = document.getElementById('calculate');
    const resetButton = document.getElementById('reset');
    const weightInput = document.getElementById('weight');
    const heightInput = document.getElementById('height');
    const ageInput = document.getElementById('age');
    const genderSelect = document.getElementById('gender');
    const goalSelect = document.getElementById('goal');
    const activitySelect = document.getElementById('activity');
    const bmiResultDiv = document.getElementById('bmi-result');
    const nutritionalPlanDiv = document.getElementById('nutritional-plan');

    // Language switching functionality will be added in a later step

    calculateButton.addEventListener('click', () => {
        const weight = parseFloat(weightInput.value);
        const height = parseFloat(heightInput.value);
        const age = parseInt(ageInput.value);
        const gender = genderSelect.value;
        const goal = goalSelect.value;
        const activity = activitySelect.value;

        // Basic validation
        if (isNaN(weight) || weight <= 0) {
            alert(getTranslation('errorWeight'));
            weightInput.focus();
            return;
        }
        if (isNaN(height) || height <= 0) {
            alert(getTranslation('errorHeight'));
            heightInput.focus();
            return;
        }
        if (isNaN(age) || age <= 0) {
            alert(getTranslation('errorAge'));
            ageInput.focus();
            return;
        }

        const heightInMeters = height / 100;
        const bmi = weight / (heightInMeters * heightInMeters);

        bmiResultDiv.innerHTML = `<p>${getTranslation('bmiResultLabel')} <strong>${bmi.toFixed(2)}</strong></p>`;

        let categoryKey = '';
        if (bmi < 18.5) {
            categoryKey = 'bmiCategoryUnderweight';
        } else if (bmi < 24.9) {
            categoryKey = 'bmiCategoryNormal';
        } else if (bmi < 29.9) {
            categoryKey = 'bmiCategoryOverweight';
        } else {
            categoryKey = 'bmiCategoryObese';
        }
        bmiResultDiv.innerHTML += `<p>${getTranslation('bmiCategoryLabel')} <strong>${getTranslation(categoryKey)}</strong></p>`;

        generateNutritionalPlan(bmi, age, gender, activity, goal);
    });

    resetButton.addEventListener('click', () => {
        weightInput.value = '';
        heightInput.value = '';
        ageInput.value = '';
        genderSelect.value = 'male'; // Default, will be translated if options are dynamic
        goalSelect.value = 'lose'; // Default
        activitySelect.value = 'sedentary'; // Default
        bmiResultDiv.innerHTML = '';
        nutritionalPlanDiv.innerHTML = '';
        // Reset placeholders to current language
        weightInput.placeholder = getTranslation('weightPlaceholder', {defaultValue: "Enter your weight"});
        heightInput.placeholder = getTranslation('heightPlaceholder', {defaultValue: "Enter your height"});
        ageInput.placeholder = getTranslation('agePlaceholder', {defaultValue: "Enter your age"});
    });

    function generateNutritionalPlan(bmi, age, gender, activity, goal) {
        let bmr; // Basal Metabolic Rate
        const currentWeight = parseFloat(weightInput.value); // Use current weight for BMR
        const currentHeight = parseFloat(heightInput.value);


        if (isNaN(currentWeight) || isNaN(currentHeight) || isNaN(age)) {
            // Should not happen if validation is correct, but as a safeguard
            nutritionalPlanDiv.innerHTML = `<p>${getTranslation('errorMissingDataForPlan')}</p>`;
            return;
        }

        if (gender === 'male') {
            bmr = 10 * currentWeight + 6.25 * currentHeight - 5 * age + 5;
        } else { // female
            bmr = 10 * currentWeight + 6.25 * currentHeight - 5 * age - 161;
        }

        let tdee; // Total Daily Energy Expenditure
        switch (activity) {
            case 'sedentary':
                tdee = bmr * 1.2;
                break;
            case 'light':
                tdee = bmr * 1.375;
                break;
            case 'moderate':
                tdee = bmr * 1.55;
                break;
            case 'active':
                tdee = bmr * 1.725;
                break;
            case 'extra':
                tdee = bmr * 1.9;
                break;
            default:
                tdee = bmr * 1.2;
        }

        let dailyCalories;
        switch (goal) {
            case 'lose':
                dailyCalories = tdee - 500; // Calorie deficit for weight loss
                break;
            case 'maintain':
                dailyCalories = tdee;
                break;
            case 'gain':
                dailyCalories = tdee + 500; // Calorie surplus for weight gain
                break;
            default:
                dailyCalories = tdee;
        }

        // Ensure daily calories are not too low
        if (dailyCalories < 1200 && gender === 'female') {
            dailyCalories = 1200;
        } else if (dailyCalories < 1500 && gender === 'male') {
            dailyCalories = 1500;
        }


        nutritionalPlanDiv.innerHTML = `
            <h3 data-translate="nutritionalPlanTitle">${getTranslation('nutritionalPlanTitle')}</h3>
            <p>${getTranslation('estimatedDailyCalories')} <strong>${Math.round(dailyCalories)} kcal</strong></p>
            <p data-translate="macronutrientRatio">${getTranslation('macronutrientRatio')}</p>
            <ul>
                <li data-translate="proteinRatio">${getTranslation('proteinRatio', { percentage: '30-35%' })}</li>
                <li data-translate="carbsRatio">${getTranslation('carbsRatio', { percentage: '40-50%' })}</li>
                <li data-translate="fatsRatio">${getTranslation('fatsRatio', { percentage: '20-25%' })}</li>
            </ul>
            <p data-translate="planDisclaimer">${getTranslation('planDisclaimer')}</p>
        `;
        // Re-apply translations if needed for dynamically generated content
        if (typeof updateTranslations === 'function') {
            updateTranslations();
        }
    }

    // --- I18n ---
    const translations = {
        en: {
            title: "BMI Health Calculator & Nutritional Plan",
            weightLabel: "Weight (kg):",
            heightLabel: "Height (cm):",
            ageLabel: "Age:",
            genderLabel: "Gender:",
            maleOption: "Male",
            femaleOption: "Female",
            goalLabel: "Select Your Goal:",
            loseWeightOption: "Lose Weight",
            maintainWeightOption: "Maintain Weight",
            gainWeightOption: "Gain Weight",
            activityLabel: "Select Your Activity Level:",
            sedentaryOption: "Sedentary (little or no exercise)",
            lightActivityOption: "Lightly active (light exercise/sports 1-3 days/week)",
            moderateActivityOption: "Moderately active (moderate exercise/sports 3-5 days/week)",
            activeActivityOption: "Very active (hard exercise/sports 6-7 days a week)",
            extraActiveActivityOption: "Extra active (very hard exercise/sports & physical job)",
            calculateButton: "Calculate",
            resetButton: "Reset",
            resultsTitle: "Results",
            aboutTitle: "About BMI & Nutritional Plan",
            aboutText: "Body Mass Index (BMI) is a measure of body fat based on height and weight that applies to adult men and women. Our nutritional plan provides recommendations based on your BMI, activity level, and goals. It's important to consult with a healthcare professional before making significant changes to your diet or exercise routine.",
            footerText: "&copy; 2023 BMI Health Calculator",
            errorWeight: "Please enter a valid weight.",
            errorHeight: "Please enter a valid height.",
            errorAge: "Please enter a valid age.",
            bmiResultLabel: "Your BMI is:",
            bmiCategoryLabel: "Category:",
            bmiCategoryUnderweight: "Underweight",
            bmiCategoryNormal: "Normal weight",
            bmiCategoryOverweight: "Overweight",
            bmiCategoryObese: "Obese",
            nutritionalPlanTitle: "Nutritional Plan Suggestion",
            estimatedDailyCalories: "Estimated Daily Caloric Intake:",
            macronutrientRatio: "Suggested Macronutrient Ratio (approximate):",
            proteinRatio: "Protein: {percentage}",
            carbsRatio: "Carbohydrates: {percentage}",
            fatsRatio: "Fats: {percentage}",
            planDisclaimer: "This is a general guideline. For a personalized plan, please consult a nutritionist or healthcare provider. Ensure you stay hydrated and include a variety of fruits, vegetables, lean proteins, and whole grains in your diet.",
            weightPlaceholder: "Enter your weight",
            heightPlaceholder: "Enter your height",
            agePlaceholder: "Enter your age",
            errorMissingDataForPlan: "Cannot generate plan, missing input data."
        },
        pt: {
            title: "Calculadora de IMC e Plano Nutricional",
            weightLabel: "Peso (kg):",
            heightLabel: "Altura (cm):",
            ageLabel: "Idade:",
            genderLabel: "Gênero:",
            maleOption: "Masculino",
            femaleOption: "Feminino",
            goalLabel: "Selecione Seu Objetivo:",
            loseWeightOption: "Perder Peso",
            maintainWeightOption: "Manter Peso",
            gainWeightOption: "Ganhar Peso",
            activityLabel: "Selecione Seu Nível de Atividade:",
            sedentaryOption: "Sedentário (pouco ou nenhum exercício)",
            lightActivityOption: "Levemente ativo (exercício leve/esportes 1-3 dias/semana)",
            moderateActivityOption: "Moderadamente ativo (exercício moderado/esportes 3-5 dias/semana)",
            activeActivityOption: "Muito ativo (exercício pesado/esportes 6-7 dias/semana)",
            extraActiveActivityOption: "Extra ativo (exercício muito pesado/esportes e trabalho físico)",
            calculateButton: "Calcular",
            resetButton: "Resetar",
            resultsTitle: "Resultados",
            aboutTitle: "Sobre o IMC e Plano Nutricional",
            aboutText: "O Índice de Massa Corporal (IMC) é uma medida da gordura corporal baseada na altura e no peso que se aplica a homens e mulheres adultos. Nosso plano nutricional fornece recomendações com base no seu IMC, nível de atividade e objetivos. É importante consultar um profissional de saúde antes de fazer alterações significativas em sua dieta ou rotina de exercícios.",
            footerText: "&copy; 2023 Calculadora de IMC",
            errorWeight: "Por favor, insira um peso válido.",
            errorHeight: "Por favor, insira uma altura válida.",
            errorAge: "Por favor, insira uma idade válida.",
            bmiResultLabel: "Seu IMC é:",
            bmiCategoryLabel: "Categoria:",
            bmiCategoryUnderweight: "Abaixo do peso",
            bmiCategoryNormal: "Peso normal",
            bmiCategoryOverweight: "Sobrepeso",
            bmiCategoryObese: "Obeso",
            nutritionalPlanTitle: "Sugestão de Plano Nutricional",
            estimatedDailyCalories: "Ingestão Calórica Diária Estimada:",
            macronutrientRatio: "Proporção Sugerida de Macronutrientes (aproximada):",
            proteinRatio: "Proteína: {percentage}",
            carbsRatio: "Carboidratos: {percentage}",
            fatsRatio: "Gorduras: {percentage}",
            planDisclaimer: "Esta é uma orientação geral. Para um plano personalizado, consulte um nutricionista ou profissional de saúde. Certifique-se de manter-se hidratado e incluir uma variedade de frutas, vegetais, proteínas magras e grãos integrais em sua dieta.",
            weightPlaceholder: "Digite seu peso",
            heightPlaceholder: "Digite sua altura",
            agePlaceholder: "Digite sua idade",
            errorMissingDataForPlan: "Não é possível gerar o plano, dados de entrada ausentes."
        },
        es: {
            title: "Calculadora de IMC y Plan Nutricional",
            weightLabel: "Peso (kg):",
            heightLabel: "Altura (cm):",
            ageLabel: "Edad:",
            genderLabel: "Género:",
            maleOption: "Masculino",
            femaleOption: "Femenino",
            goalLabel: "Seleccione Su Objetivo:",
            loseWeightOption: "Perder Peso",
            maintainWeightOption: "Mantener Peso",
            gainWeightOption: "Ganar Peso",
            activityLabel: "Seleccione Su Nivel de Actividad:",
            sedentaryOption: "Sedentario (poco o ningún ejercicio)",
            lightActivityOption: "Ligeramente activo (ejercicio ligero/deportes 1-3 días/semana)",
            moderateActivityOption: "Moderadamente activo (ejercicio moderado/deportes 3-5 días/semana)",
            activeActivityOption: "Muy activo (ejercicio intenso/deportes 6-7 días a la semana)",
            extraActiveActivityOption: "Extra activo (ejercicio muy intenso/deportes y trabajo físico)",
            calculateButton: "Calcular",
            resetButton: "Reiniciar",
            resultsTitle: "Resultados",
            aboutTitle: "Sobre el IMC y Plan Nutricional",
            aboutText: "El Índice de Masa Corporal (IMC) es una medida de la grasa corporal basada en la altura y el peso que se aplica a hombres y mujeres adultos. Nuestro plan nutricional proporciona recomendaciones basadas en su IMC, nivel de actividad y objetivos. Es importante consultar a un profesional de la salud antes de realizar cambios significativos en su dieta o rutina de ejercicios.",
            footerText: "&copy; 2023 Calculadora de IMC",
            errorWeight: "Por favor, ingrese un peso válido.",
            errorHeight: "Por favor, ingrese una altura válida.",
            errorAge: "Por favor, ingrese una edad válida.",
            bmiResultLabel: "Su IMC es:",
            bmiCategoryLabel: "Categoría:",
            bmiCategoryUnderweight: "Bajo peso",
            bmiCategoryNormal: "Peso normal",
            bmiCategoryOverweight: "Sobrepeso",
            bmiCategoryObese: "Obeso",
            nutritionalPlanTitle: "Sugerencia de Plan Nutricional",
            estimatedDailyCalories: "Ingesta Calórica Diaria Estimada:",
            macronutrientRatio: "Proporción Sugerida de Macronutrientes (aproximada):",
            proteinRatio: "Proteína: {percentage}",
            carbsRatio: "Carbohidratos: {percentage}",
            fatsRatio: "Grasas: {percentage}",
            planDisclaimer: "Esta es una guía general. Para un plan personalizado, consulte a un nutricionista o proveedor de atención médica. Asegúrese de mantenerse hidratado e incluir una variedad de frutas, verduras, proteínas magras y granos integrales en su dieta.",
            weightPlaceholder: "Ingrese su peso",
            heightPlaceholder: "Ingrese su altura",
            agePlaceholder: "Ingrese su edad",
            errorMissingDataForPlan: "No se puede generar el plan, faltan datos de entrada."
        }
    };

    let currentLanguage = 'en'; // Default language

    function getTranslation(key, params = {}) {
        let text = translations[currentLanguage]?.[key] || translations['en']?.[key] || key; // Fallback to English if key not found in current lang or current lang doesn't exist
        for (const param in params) {
            text = text.replace(`{${param}}`, params[param]);
        }
        return text;
    }

    function updateTranslations() {
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            const paramsString = element.getAttribute('data-translate-params');
            let params = {};
            if (paramsString) {
                try {
                    params = JSON.parse(paramsString);
                } catch (e) {
                    console.error("Error parsing translation params: ", e);
                }
            }
            element.innerHTML = getTranslation(key, params);
        });
        // Update placeholders for input fields if necessary
        // Example: document.getElementById('weight').placeholder = getTranslation('weightPlaceholder');
        // This requires adding placeholder keys to the translation object and data-translate attributes to inputs.
        // For now, we'll rely on labels being translated.
         weightInput.placeholder = getTranslation('weightPlaceholder', {defaultValue: "Enter your weight"});
         heightInput.placeholder = getTranslation('heightPlaceholder', {defaultValue: "Enter your height"});
         ageInput.placeholder = getTranslation('agePlaceholder', {defaultValue: "Enter your age"});
    }

    // Make changeLanguage global so it can be called from HTML
    window.changeLanguage = function(lang) {
        if (translations[lang]) {
            currentLanguage = lang;
            document.documentElement.lang = lang; // Update the lang attribute of the HTML element
            updateTranslations();
            // If results are already displayed, re-calculate and re-display them to update translated strings within results
            if (bmiResultDiv.innerHTML !== '') {
                calculateButton.click(); // Simulate click to re-generate results with new language
            }
        } else {
            console.warn(`Language "${lang}" not found.`);
        }
    };

    // Initial translation update on page load
    updateTranslations();
});
