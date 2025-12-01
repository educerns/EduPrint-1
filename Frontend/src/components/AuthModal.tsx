
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Mail } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import axios from "../services/api";
import { error } from "console";
interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    company: ""
  });

  const { login, signup } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const success = await login(formData.email, formData.password);
        const res = await axios.post("/api/eduprintverifyOtp", formData)
        console.log('eror aya hia kya',res.data);
        if(res.data.message=="Login details verify wait for otp verify"){
          localStorage.setItem("token", res.data.token);
           toast({
            title: "Welcome back!",
            description: "You have been successfully logged in.",
          });
          onClose();
        }
        else {
          toast({
            title: "Login failed",
            description: "Invalid email or password. Please try again.",
            variant: "destructive",
          });
        }
        
      } else {
        if (formData.password !== formData.confirmPassword) {
          toast({
            title: "Password mismatch",
            description: "Passwords do not match. Please try again.",
            variant: "destructive",
          });
          return;
        }

        const success = await signup({
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          company: formData.company,
          password: formData.password
        });

        if (success) {
          toast({
            title: "Account created!",
            description: "Your account has been created successfully.",
          });
          onClose();
        } else {
          toast({
            title: "Signup failed",
            description: "Email already exists. Please try logging in.",
            variant: "destructive",
          });
        }
      }
    }
    catch(error){
      console.log('eerror ha',error.response.data);
      if(error.response.data.message=="Incorrect password"){
         toast({
            title: "Password Error",
            description: "Passwords is wrong.",
            variant: "destructive",
          });
      }
         if(error.response.data.message=="User not found"){
         toast({
            title: "Center Error",
            description: "Center not found.",
            variant: "destructive",
          });
      }
    }
    finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            {isLogin ? "Welcome Back" : "Create Account"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="company">Company Name</Label>
                <Input
                  id="company"
                  name="company"
                  type="text"
                  value={formData.company}
                  onChange={handleInputChange}
                />
              </div>
            </>
          )}

          <div>
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="email"
                name="email"
                type="email"
                required
                className="pl-10"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter Pasword"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="••••••••"
              />
            </div>
          )}

          <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
            {isLoading ? "Processing..." : (isLogin ? "Sign In" : "Create Account")}
          </Button>

          <Separator />

          {/* <div className="text-center text-sm">
            <span className="text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </span>
            <Button
              variant="link"
              className="ml-1 p-0 h-auto font-semibold text-blue-600"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Sign up" : "Sign in"}
            </Button>
          </div> */}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
