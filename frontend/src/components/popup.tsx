import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const UpdateProfileDialog: React.FC<Props> = ({ open, setOpen }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((store: any) => store.auth);

  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    bio: "",
    skills: "",
    file: null as File | null,
  });

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

  const changeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const fileChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
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

    const skillsArray = input.skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    skillsArray.forEach((skill) => formData.append("skills[]", skill));

    if (input.file) formData.append("file", input.file);

    try {
      setLoading(true);

      const res = await axios.post(
        `${USER_API_END_POINT}/profile/update`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        setOpen(false);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 max-w-lg rounded-xl">

        {/* HEADER */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <DialogTitle className="text-lg font-semibold">
              Update Profile
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Update your personal information and resume.
            </DialogDescription>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="rounded-md p-2 hover:bg-muted transition"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={submitHandler}>
          <div className="max-h-[60vh] overflow-y-auto px-6 py-4 space-y-4">
            
            <div>
              <Label>Name</Label>
              <Input name="fullname" value={input.fullname} onChange={changeEventHandler} />
            </div>

            <div>
              <Label>Email</Label>
              <Input name="email" value={input.email} onChange={changeEventHandler} />
            </div>

            <div>
              <Label>Phone Number</Label>
              <Input name="phoneNumber" value={input.phoneNumber} onChange={changeEventHandler} />
            </div>

            <div>
              <Label>Bio</Label>
              <Input name="bio" value={input.bio} onChange={changeEventHandler} />
            </div>

            <div>
              <Label>Skills</Label>
              <Input
                name="skills"
                value={input.skills}
                onChange={changeEventHandler}
                placeholder="React, Node, MongoDB"
              />
            </div>

            <div>
              <Label>Resume</Label>
              <Input type="file" accept="application/pdf" onChange={fileChangeHandler} />
            </div>

          </div>

          {/* FOOTER */}
          <DialogFooter className="border-t px-6 py-4">
            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Updating..." : "Update Profile"}
            </Button>
          </DialogFooter>
        </form>

      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfileDialog;
