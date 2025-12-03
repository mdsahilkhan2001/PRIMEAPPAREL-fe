import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
//import API from "../../api"; // <-- update path if needed
import API from "../api/index"

const Costing = () => {
    const [searchParams] = useSearchParams();
    const leadId = searchParams.get("leadId");

    const [formData, setFormData] = useState({
        styleName: "",
        fabricCost: "",
        fabricConsumption: "",
        trimCost: "",
        cmCost: "",
        packingCost: "",
        overheadCost: "",
        profitMargin: "20",
        leadId: ""
    });

    const [result, setResult] = useState(null);

    // Auto-fill lead ID when present in URL
    useEffect(() => {
        if (leadId) {
            setFormData((prev) => ({ ...prev, leadId }));
        }
    }, [leadId]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Calculation logic
    const calculate = () => {
        const fabric =
            parseFloat(formData.fabricCost || 0) *
            parseFloat(formData.fabricConsumption || 0);

        const trim = parseFloat(formData.trimCost || 0);
        const cm = parseFloat(formData.cmCost || 0);
        const packing = parseFloat(formData.packingCost || 0);
        const overhead = parseFloat(formData.overheadCost || 0);

        const baseCost = fabric + trim + cm + packing + overhead;
        const profit = baseCost * (parseFloat(formData.profitMargin || 0) / 100);
        const exw = baseCost + profit;

        setResult({ baseCost, profit, exw });

        return { baseCost, profit, exw };
    };

    const handleSave = async () => {
        try {
            const finalCost = calculate(); // auto calculate before saving

            const payload = {
                ...formData,
                baseCost: finalCost.baseCost,
                profitAmount: finalCost.profit,
                exwPrice: finalCost.exw
            };

            await API.post("/costings", payload);

            alert("Costing saved successfully!");
        } catch (error) {
            console.error(error);
            alert("Error saving costing");
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
                Costing Calculator
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* FORM SECTION */}
                <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Style Name
                        </label>
                        <input
                            type="text"
                            name="styleName"
                            value={formData.styleName}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg"
                        />
                    </div>

                    {/* Fabric Section */}
                    <div className="grid grid-cols-2 gap-4">
                        <InputField
                            label="Fabric Cost (per mtr)"
                            name="fabricCost"
                            value={formData.fabricCost}
                            handleChange={handleChange}
                        />
                        <InputField
                            label="Consumption (mtrs)"
                            name="fabricConsumption"
                            value={formData.fabricConsumption}
                            handleChange={handleChange}
                        />
                    </div>

                    {/* CM + Trim */}
                    <div className="grid grid-cols-2 gap-4">
                        <InputField
                            label="CM Cost"
                            name="cmCost"
                            value={formData.cmCost}
                            handleChange={handleChange}
                        />
                        <InputField
                            label="Trims Cost"
                            name="trimCost"
                            value={formData.trimCost}
                            handleChange={handleChange}
                        />
                    </div>

                    {/* Packing + Overhead */}
                    <div className="grid grid-cols-2 gap-4">
                        <InputField
                            label="Packing Cost"
                            name="packingCost"
                            value={formData.packingCost}
                            handleChange={handleChange}
                        />
                        <InputField
                            label="Overhead Cost"
                            name="overheadCost"
                            value={formData.overheadCost}
                            handleChange={handleChange}
                        />
                    </div>

                    <InputField
                        label="Profit Margin (%)"
                        name="profitMargin"
                        value={formData.profitMargin}
                        handleChange={handleChange}
                    />

                    {/* Buttons */}
                    <div className="flex space-x-4 pt-4">
                        <button
                            onClick={calculate}
                            className="flex-1 bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900"
                        >
                            Calculate
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex-1 bg-accent text-primary font-bold py-2 rounded-lg hover:bg-yellow-500"
                        >
                            Save Costing
                        </button>
                    </div>
                </div>

                {/* RESULT SECTION */}
                <div className="bg-gray-50 p-6 rounded-xl border h-fit">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">
                        Cost Breakdown
                    </h3>

                    {result ? (
                        <div className="space-y-4">
                            <CostRow label="Base Cost" value={result.baseCost} />
                            <CostRow label="Profit Amount" value={result.profit} />

                            <div className="border-t pt-4 flex justify-between text-xl font-bold text-primary">
                                <span>EXW Price</span>
                                <span>${result.exw.toFixed(2)}</span>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-10">
                            Enter values and click Calculate to see the breakdown.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

// Reusable input field component
const InputField = ({ label, name, value, handleChange }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
        </label>
        <input
            type="number"
            name={name}
            value={value}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
        />
    </div>
);

// Row for displaying costs
const CostRow = ({ label, value }) => (
    <div className="flex justify-between text-gray-600">
        <span>{label}</span>
        <span>${value.toFixed(2)}</span>
    </div>
);

export default Costing;
