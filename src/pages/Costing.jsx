import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import API from '../api';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

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
    const [chartData, setChartData] = useState([]);

    // Modern color palette for the chart
    const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#6366F1', '#EC4899', '#8B5CF6'];

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

        const newChartData = [
            { name: 'Fabric', value: fabric },
            { name: 'Trims', value: trim },
            { name: 'CM', value: cm },
            { name: 'Packing', value: packing },
            { name: 'Overhead', value: overhead },
            { name: 'Profit', value: profit }
        ];

        setChartData(newChartData);
        setResult({ baseCost, profit, exw, fabric, trim, cm, packing, overhead });

        return { baseCost, profit, exw };
    };

    const handleSave = async () => {
        try {
            await API.post('/costings', formData);
            alert('Costing saved successfully!');
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent focus:outline-none"
                            placeholder="Enter Style/Product Name"
                        />
                    </div>

                    {/* Fabric Section */}
                    <div className="p-4 bg-blue-50/50 rounded-lg space-y-4 border border-blue-100">
                        <h4 className="text-sm font-bold text-blue-700 uppercase tracking-wider">Fabric Costs</h4>
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
                    </div>

                    {/* Manufacturing Costs */}
                    <div className="p-4 bg-orange-50/50 rounded-lg space-y-4 border border-orange-100">
                        <h4 className="text-sm font-bold text-orange-700 uppercase tracking-wider">Manufacturing Costs</h4>
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
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <InputField
                            label="Profit Margin (%)"
                            name="profitMargin"
                            value={formData.profitMargin}
                            handleChange={handleChange}
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex space-x-4 pt-4">
                        <button
                            onClick={calculate}
                            className="flex-1 bg-gray-900 text-white py-3 rounded-lg hover:bg-black font-bold shadow-lg transition-all"
                        >
                            Calculate Cost
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex-1 bg-accent text-white py-3 rounded-lg hover:bg-opacity-90 font-bold shadow-lg transition-all"
                        >
                            Save Costing
                        </button>
                    </div>
                </div>

                {/* RESULT SECTION */}
                <div className="bg-white p-6 rounded-xl shadow-sm border h-fit">
                    <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <div className="w-1 h-5 bg-accent rounded-full"></div>
                        Cost Breakdown Results
                    </h3>

                    {result ? (
                        <div className="space-y-6">
                            {/* Chart Area */}
                            <div className="h-64 w-full bg-slate-50 rounded-xl p-2 relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={chartData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value) => `$${value.toFixed(2)}`}
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        />
                                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -mt-4 text-center">
                                    <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total</div>
                                    <div className="text-xl font-bold text-primary">${result.exw.toFixed(2)}</div>
                                </div>
                            </div>

                            {/* Detailed Breakdown List */}
                            <div className="space-y-3">
                                <CostRow label="Fabric" value={result.fabric} color={COLORS[0]} />
                                <CostRow label="Trims" value={result.trim} color={COLORS[1]} />
                                <CostRow label="CM (Cut & Make)" value={result.cm} color={COLORS[2]} />
                                <CostRow label="Packing" value={result.packing} color={COLORS[3]} />
                                <CostRow label="Overhead" value={result.overhead} color={COLORS[4]} />

                                <div className="border-t border-dashed border-gray-200 my-4"></div>

                                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                    <div className="flex justify-between text-gray-600 font-medium">
                                        <span>Base Cost</span>
                                        <span>${result.baseCost.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-emerald-600 font-medium items-center">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[5] }}></div>
                                            <span>Profit Amount ({formData.profitMargin}%)</span>
                                        </div>
                                        <span>+${result.profit.toFixed(2)}</span>
                                    </div>
                                    <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between text-2xl font-bold text-primary">
                                        <span>EXW Price</span>
                                        <span>${result.exw.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-96 flex flex-col items-center justify-center text-gray-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4 text-slate-300"><circle cx="12" cy="12" r="10"></circle><path d="M16 16s-1.5-2-4-2-4 2-4 2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
                            <p className="text-center font-medium">
                                Enter cost details and calculate<br />to generate analysis
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Reusable input field component
const InputField = ({ label, name, value, handleChange }) => (
    <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            {label}
        </label>
        <input
            type="number"
            name={name}
            value={value}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent focus:outline-none transition-all placeholder-slate-300"
            placeholder="0.00"
        />
    </div>
);

// Row for displaying costs
const CostRow = ({ label, value, color }) => (
    <div className="flex justify-between items-center text-sm group hover:bg-gray-50 p-1.5 rounded transition-colors">
        <div className="flex items-center gap-2 text-gray-600">
            {color && <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>}
            <span className="group-hover:text-gray-900 transition-colors">{label}</span>
        </div>
        <span className="font-semibold text-gray-700">${value?.toFixed(2)}</span>
    </div>
);

export default Costing;
