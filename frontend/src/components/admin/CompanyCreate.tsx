import React, { useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { COMPANY_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { setSingleCompany } from '@/redux/companySlice';
import { Loader2 } from 'lucide-react'; 

const CompanyCreate: React.FC = () => {
    const navigate = useNavigate();
    const [companyName, setCompanyName] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false); 
    const dispatch = useDispatch();

    const registerNewCompany = async () => {
        try {
            const res = await axios.post(`${COMPANY_API_END_POINT}/register`, { companyName }, { withCredentials: true });

            if (res?.data?.success) {
                dispatch(setSingleCompany(res.data.company));

                const companyId = res?.data?.company?._id;

                toast.success("Company name registered! Now let's complete the setup.");

                navigate(`/admin/companies/${companyId}`);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className='max-w-4xl mx-auto p-10'>
                <div className='my-10'>
                    <h1 className='font-bold text-3xl font-heading'>Create Your Company</h1>
                    <p className='text-muted-foreground mt-2'>
                        Provide a name for your company. You will be redirected to complete the setup.
                    </p>
                </div>

                <div className='space-y-4'>
                    <div className='grid w-full max-w-sm items-center gap-1.5'>
                        <Label htmlFor="companyName" className="font-semibold">Company Name</Label>
                        <Input
                            id="companyName"
                            type="text"
                            className="my-2"
                            placeholder="e.g. Google, Microsoft, WEBX"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                        />
                    </div>
                </div>

                <div className='flex items-center gap-4 my-10'>
                    <Button
                        variant="outline"
                        onClick={() => navigate("/admin/companies")}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={registerNewCompany}
                        className="bg-primary hover:bg-primary/90"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                Please wait
                            </>
                        ) : (
                            "Continue"
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CompanyCreate;
