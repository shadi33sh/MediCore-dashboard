'use client'
import React, { useState } from 'react';
import Loading from '../../../Components/loading';

function BMICalculator() {
  const [formData, setFormData] = useState({
    weight: '',
    height: '',
    sex: '',
    age: '',
    waist: '',
    hip: ''
  });

  const [bmiResult, setBmiResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e : any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateMetrics = () => {
    const weight = parseFloat(formData.weight);
    const heightCm = parseFloat(formData.height);
    const heightM = heightCm / 100; // Convert cm to meters
    const age = parseInt(formData.age);
    const waist = parseFloat(formData.waist);
    const hip = parseFloat(formData.hip);
    const sex = formData.sex.toLowerCase();

    if (!weight || !heightCm || !age || !waist || !hip || !sex) {
      setError('Please enter valid values for all fields.');
      return;
    }

    // **BMI Calculation**
    const bmiValue = (weight / (heightM * heightM)).toFixed(2) as unknown as number;
    const bmiStatus = bmiValue < 18.5 ? 'Underweight'
                      : bmiValue >= 18.5 && bmiValue < 24.9 ? 'Normal weight'
                      : bmiValue >= 25 && bmiValue < 29.9 ? 'Overweight'
                      : 'Obese';

    // **Ideal Weight Range (Broca’s Index)**
    const idealWeightMin = (18.5 * heightM * heightM).toFixed(1);
    const idealWeightMax = (24.9 * heightM * heightM).toFixed(1);
    const idealWeightRange = `${idealWeightMin}kg to ${idealWeightMax}kg`;

    // **Waist-to-Hip Ratio (WHR)**
    const whrValue = (waist / hip).toFixed(2) as unknown as number;
    const whrStatus = sex === 'm' ? (whrValue < 0.9 ? 'Low Risk' : whrValue < 1 ? 'Moderate Risk' : 'High Risk')
                                   : (whrValue < 0.8 ? 'Low Risk' : whrValue < 0.85 ? 'Moderate Risk' : 'High Risk');

    // **Waist-to-Height Ratio (WHtR)**
    const whtrValue = ((waist / heightCm) * 100).toFixed(1) as unknown as number;
    const whtrStatus = whtrValue < 35 ? 'Underweight'
                        : whtrValue >= 35 && whtrValue < 45 ? 'Healthy'
                        : whtrValue >= 45 && whtrValue < 55 ? 'Overweight'
                        : 'Obese';

    // **Basal Metabolic Rate (BMR) (Mifflin-St Jeor Equation)**
    const bmrValue = sex === 'm' ? (88.36 + (13.4 * weight) + (4.8 * heightCm) - (5.7 * age)).toFixed(1)
                                  : (447.6 + (9.2 * weight) + (3.1 * heightCm) - (4.3 * age)).toFixed(1);

    setBmiResult({
      bmi: { value: bmiValue, status: bmiStatus },
      ideal_weight: idealWeightRange,
      whr: { value: whrValue, status: whrStatus },
      whtr: { value: whtrValue, status: whtrStatus },
      bmr: { value: bmrValue }
    });
    setError('');
  };

  const handleSubmit = (e : any) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      calculateMetrics();
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="w-fit mx-auto p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">BMI Calculator</h2>
      <form onSubmit={handleSubmit} className="space-y-4 p-4 rounded-xl bg-gray-200 dark:bg-gray-800 flex flex-col items-center gap-8">
        <div className="flex gap-3">
          <input type="number" name="weight" placeholder="Weight (kg)" value={formData.weight} onChange={handleChange} className="dark:bg-black bg-gray-100 p-4 w-full rounded-xl pl-6 border-Primary"/>
          <input type="number" name="height" placeholder="Height (cm)" value={formData.height} onChange={handleChange} className="dark:bg-black bg-gray-100 p-4 w-full rounded-xl pl-6 border-Primary"/>
        </div>
        <input type="text" name="sex" placeholder="Sex (m/f)" value={formData.sex} onChange={handleChange} className="dark:bg-black bg-gray-100 p-4 w-full rounded-xl pl-6 border-Primary"/>
        <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} className="dark:bg-black bg-gray-100 p-4 w-full rounded-xl pl-6 border-Primary"/>
        <div className="flex gap-3">
          <input type="number" name="waist" placeholder="Waist (cm)" value={formData.waist} onChange={handleChange} className="dark:bg-black bg-gray-100 p-4 w-full rounded-xl pl-6 border-Primary"/>
          <input type="number" name="hip" placeholder="Hip (cm)" value={formData.hip} onChange={handleChange} className="dark:bg-black bg-gray-100 p-4 w-full rounded-xl pl-6 border-Primary"/>
        </div>
          {loading ?
           <Loading /> 
           :
           <button type="submit" className="bg-Primary text-white px-4 py-2 rounded-xl w-full">
            Calculate
        </button>
        }
      </form>

      {error && <p className="text-red-500 mt-3">{error}</p>}

      {bmiResult && (
        <div className="mt-4 p-4 bg-gray-200 dark:bg-gray-700 rounded-md">
          <h3 className="font-bold text-gray-800 dark:text-white">Results:</h3>
          <p><strong>BMI Value:</strong> {bmiResult.bmi.value} - {bmiResult.bmi.status}</p>
          <p><strong>Ideal Weight Range:</strong> {bmiResult.ideal_weight}</p>
          <p><strong>Waist-to-Hip Ratio:</strong> {bmiResult.whr.value} ({bmiResult.whr.status})</p>
          <p><strong>Waist-to-Height Ratio:</strong> {bmiResult.whtr.value} ({bmiResult.whtr.status})</p>
          <p><strong>Basal Metabolic Rate (BMR):</strong> {bmiResult.bmr.value} kcal/day</p>
        </div>
      )}
    </div>
  );
}

export default BMICalculator;
