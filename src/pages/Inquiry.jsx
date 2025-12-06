import { useState } from 'react';
import { Upload } from 'lucide-react';
import { createLead } from '../api';

const Inquiry = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        country: '',
        productType: 'Kaftans',
        quantity: '',
        budget: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createLead(formData);
            alert('Thank you! Your inquiry has been sent. We will contact you shortly.');
            setFormData({
                name: '',
                email: '',
                country: '',
                productType: 'Kaftans',
                quantity: '',
                budget: '',
                message: ''
            });
        } catch (error) {
            console.error(error);
            alert('Something went wrong. Please try again.');
        }
    };

    return (
        <div className="py-10 bg-gray-50 min-h-screen">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-primary py-8 px-8 text-center">
                        <h1 className="text-3xl font-bold text-white mb-2">Request a Quote</h1>
                        <p className="text-gray-300">Tell us about your requirements and we'll get back to you with a customized proposal.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                                    placeholder="Your Name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                                    placeholder="you@company.com"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                                <input
                                    type="text"
                                    name="country"
                                    required
                                    value={formData.country}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                                    placeholder="USA, UK, etc."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Product Interest</label>
                                <select
                                    name="productType"
                                    value={formData.productType}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                                >
                                    <option>Kaftans</option>
                                    <option>Co-ords</option>
                                    <option>Resort Wear</option>
                                    <option>Loungewear</option>
                                    <option>Other</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Quantity (per style)</label>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                                    placeholder="e.g. 100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Target Budget (USD)</label>
                                <input
                                    type="text"
                                    name="budget"
                                    value={formData.budget}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                                    placeholder="e.g. $15-20 per piece"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Reference Images (Optional)</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 cursor-pointer">
                                <Upload className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                                <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                                <p className="text-xs text-gray-400 mt-1">JPG, PNG, PDF up to 10MB</p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Additional Details</label>
                            <textarea
                                name="message"
                                rows="4"
                                value={formData.message}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                                placeholder="Tell us more about your brand and requirements..."
                            ></textarea>
                        </div>

                        <button type="submit" className="w-full bg-accent text-primary font-bold py-4 rounded-lg hover:bg-yellow-500 shadow-lg text-lg cursor-pointer">
                            Submit Inquiry
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Inquiry;
