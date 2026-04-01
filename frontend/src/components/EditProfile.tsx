import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import Navbar from "@/components/shared/Navbar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const { user } = useSelector((store: any) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    bio: "",
    skills: "",
    file: null as File | null,
  });

  // ✅ Load user data
  useEffect(() => {
    if (user) {
      setInput({
        fullname: user.fullname || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        bio: user.profile?.bio || "",
        skills: user.profile?.skills?.join(", ") || "",
        file: null,
      });
    }
  }, [user]);

  const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const fileHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setInput({ ...input, file });
  };

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("bio", input.bio);
    formData.append("skills", input.skills);

    if (input.file) formData.append("file", input.file);

    try {
      setLoading(true);

      const res = await axios.post(
        `${USER_API_END_POINT}/profile/update`,
        formData,
        { withCredentials: true }
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success("Profile updated successfully");
        navigate("/profile"); // 🔥 go back
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow mt-6">
        <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>

        <form onSubmit={submitHandler} className="space-y-5">

          <div>
            <Label>Name</Label>
            <Input name="fullname" value={input.fullname} onChange={changeHandler} />
          </div>

          <div>
            <Label>Email</Label>
            <Input name="email" value={input.email} onChange={changeHandler} />
          </div>

          <div>
            <Label>Phone</Label>
            <Input name="phoneNumber" value={input.phoneNumber} onChange={changeHandler} />
          </div>

          <div>
            <Label>Bio</Label>
            <Input name="bio" value={input.bio} onChange={changeHandler} />
          </div>

          <div>
            <Label>Skills</Label>
            <Input name="skills" value={input.skills} onChange={changeHandler} />
          </div>

          <div>
            <Label>Resume</Label>
            <Input type="file" onChange={fileHandler} />
          </div>

          <Button className="w-full">
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Updating...
              </>
            ) : (
              "Update Profile"
            )}
          </Button>

        </form>
      </div>
    </div>
  );
};

export default EditProfile;