"use client"
import { useState } from 'react';

const WizardForm = () => {
    const [step, setStep] = useState(1);
    const totalSteps = 3;

    const nextStep = () => {
        if (step < totalSteps) setStep(step + 1);
    };

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex justify-between mb-2">
                    {[1, 2, 3].map((item) => (
                        <div key={item} className="flex flex-col items-center">
                            <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 
                                ${step >= item ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-300 text-gray-300'}`}>
                                {item}
                            </div>
                            <span className={`text-sm mt-2 ${step >= item ? 'text-blue-500' : 'text-gray-400'}`}>
                                Step {item}
                            </span>
                        </div>
                    ))}
                </div>
                <div className="relative w-full h-2 bg-gray-200 rounded">
                    <div 
                        className="absolute h-full bg-blue-500 rounded transition-all duration-300"
                        style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
                    ></div>
                </div>
            </div>

            {/* Form Content */}
            <div className="mb-8">
                {step === 1 && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold">Personal Information</h2>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input 
                                type="text" 
                                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter your full name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input 
                                type="email" 
                                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter your email"
                            />
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold">Contact Details</h2>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <input 
                                type="tel" 
                                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter your phone number"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <textarea 
                                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter your address"
                                rows={3}
                            ></textarea>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold">Confirmation</h2>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input 
                                type="password" 
                                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter your password"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                            <input 
                                type="password" 
                                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Confirm your password"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
                <button 
                    onClick={prevStep}
                    className={`px-4 py-2 rounded ${step === 1 
                        ? 'bg-gray-300 cursor-not-allowed' 
                        : 'bg-gray-500 hover:bg-gray-600 text-white'}`}
                    disabled={step === 1}
                >
                    Previous
                </button>
                <button 
                    onClick={step === totalSteps ? () => console.log('Form submitted!') : nextStep}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    {step === totalSteps ? 'Submit' : 'Next'}
                </button>
            </div>
        </div>
    );
};

export default WizardForm;
