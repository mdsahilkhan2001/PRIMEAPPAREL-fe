import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import API from '../api';

const Costing = () => {
    const [formData, setFormData] = useState({
        styleName: '',
        fabricCost: '',
        fabricConsumption: '',
        trimCost: '',
        cmCost: '',
        packingCost: '',
        overheadCost: '',
        profitMargin: '20'
    });

    const [result, setResult] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const calculate = () => {
        const fabric = parseFloat(formData.fabricCost || 0) * parseFloat(formData.fabricConsumption || 0);
        const trim = parseFloat(formData.trimCost || 0);
        const cm = parseFloat(formData.cmCost || 0);
        const packing = parseFloat(formData.packingCost || 0);
        const overhead = parseFloat(formData.overheadCost || 0);

        const baseCost = fabric + trim + cm + packing + overhead;
        const profit = baseCost * (parseFloat(formData.profitMargin || 0) / 100);
        const exw = baseCost + profit;

        setResult({ baseCost, profit, exw });
    };

    const [searchParams] = useSearchParams();
    const leadId = searchParams.get('leadId');

    useEffect(() => {
        if (leadId) {
            // Fetch lead details to pre-fill
            const fetchLeadDetails = async () => {
                try {
                    // Assuming we have an API to get a single lead, or we can just use the ID
                    // For now, we'll just set the leadId in the form and maybe fetch if needed
                    // In a real app, we'd fetch the lead here: const { data } = await axios.get(`/api/leads/${leadId}`);
                    // setFormData(prev => ({ ...prev, styleName: data.productType, leadId }));
                    setFormData(prev => ({ ...prev, leadId }));
                } catch (error) {
                    console.error("Error fetching lead details", error);
                }
            };
            fetchLeadDetails();
        }
    }, [leadId]);

    const handleSave = async () => {
        try {
            await API.post('/costings', formData);
            alert('Costing saved successfully!');
        } catch (error) {
            console.error(error);
            alert('Error saving costing');
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Costing Calculator</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Form */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Style Name</label>
                        <input type="text" name="styleName" value={formData.styleName} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Fabric Cost (per mtr)</label>
                            <input type="number" name="fabricCost" value={formData.fabricCost} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Consumption (mtrs)</label>
                            <input type="number" name="fabricConsumption" value={formData.fabricConsumption} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">CM Cost</label>
                            <input type="number" name="cmCost" value={formData.cmCost} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Trims Cost</label>
                            <input type="number" name="trimCost" value={formData.trimCost} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Packing Cost</label>
                            <input type="number" name="packingCost" value={formData.packingCost} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Overhead</label>
                            <input type="number" name="overheadCost" value={formData.overheadCost} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Profit Margin (%)</label>
                        <input type="number" name="profitMargin" value={formData.profitMargin} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
                    </div>

                    <div className="flex space-x-4 pt-4">
                        <button onClick={calculate} className="flex-1 bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900">Calculate</button>
                        <button onClick={handleSave} className="flex-1 bg-accent text-primary font-bold py-2 rounded-lg hover:bg-yellow-500">Save Costing</button>
                    </div>
                </div>

                {/* Result */}
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 h-fit">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Cost Breakdown</h3>
                    {result ? (
                        <div className="space-y-4">
                            <div className="flex justify-between text-gray-600">
                                <span>Base Cost</span>
                                <span>${result.baseCost.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Profit Amount</span>
                                <span>${result.profit.toFixed(2)}</span>
                            </div>
                            <div className="border-t border-gray-300 pt-4 flex justify-between text-xl font-bold text-primary">
                                <span>EXW Price</span>
                                <span>${result.exw.toFixed(2)}</span>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-10">Enter values and click Calculate to see the breakdown.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Costing;
