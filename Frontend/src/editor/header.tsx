import React, { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { ChevronDown, Eye, Pencil, Save, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";
import { useEditorStore } from "@/store/store";

interface SessionUser {
  name?: string;
  image?: string;
}

export default function Header() {
  const { isEditing, setIsEditing, name, setName, canvas } = useEditorStore();

    // Mock session object (replace this later with your real auth data)
  const session: { user?: SessionUser } = {
    user: {
      name: "John Doe",
      image: "",
    },
  };
  console.log("Setting name to:", name);
  console.log("isEditing",isEditing);
  
  useEffect(() =>{
    if(!canvas) return;
    canvas.selection = isEditing;
    canvas.getObjects().forEach((obj)=>{
      obj.selectable = isEditing;
      obj.evented = isEditing
    })
  }, [isEditing])


  return (
    <header className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white shadow-md flex items-center justify-between px-4 h-14 relative z-[10000]">
      
      {/* LEFT: Mode switch */}
      <div className="flex items-center space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center text-white font-medium focus:outline-none">
              <span>{isEditing ? "Editing" : "Viewing"}</span>
              <ChevronDown className="ml-1 h-4 w-4" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="start"
            className="bg-white text-gray-800 rounded-md shadow-md mt-2 p-1 min-w-[130px] border border-gray-200 z-[99999]"
          >
            <DropdownMenuItem
              onClick={() => setIsEditing(true)}
              className={`flex items-center px-2 py-1.5 rounded cursor-pointer hover:bg-blue-100 ${
                isEditing ? "bg-blue-50 font-semibold text-blue-700" : ""
              }`}
            >
              <Pencil className="mr-2 h-4 w-4 text-blue-600" />
              <span>Editing</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => setIsEditing(false)}
              className={`flex items-center px-2 py-1.5 rounded cursor-pointer hover:bg-blue-100 ${
                !isEditing ? "bg-blue-50 font-semibold text-blue-700" : ""
              }`}
            >
              <Eye className="mr-2 h-4 w-4 text-blue-600" />
              <span>Viewing</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
           <button className="flex items-center justify-center  hover:bg-white/20 px-3 py-1.5  transition-colors duration-200">
      <Save className="w-5 h-5 text-white" />
    </button>
  
      </div>


  
      {/* CENTER: File name */}
       <div className="flex-1 flex justify-center">
    <input
      className="text-center bg-white/10 border border-white/20 rounded px-3 py-1 text-white placeholder-white focus:outline-none focus:ring-1 focus:ring-white w-64"
      value={name}
      onChange={(e) => setName(e.target.value)}
      placeholder="Untitled design"
    />
  </div>

  
 

      <div>
       <button
className="upgrade-button flex items-center bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium px-3 py-1.5 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md"
    >
      <Star className="mr-1 h-4 w-4 text-yellow-400" />
      <span>Upgrade your plan</span>
    </button>
      </div>
       <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center space-x-2 cursor-pointer">
          <Avatar>
            <AvatarImage
              src={session?.user?.image || "/placeholder-user.jpg"}
              alt={session?.user?.name || "User"}
            />
            <AvatarFallback>
              {session?.user?.name?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>

          <span className="text-sm font-medium hidden lg:block">
            {session?.user?.name || "User"}
          </span>
          
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="bg-white text-gray-800 rounded-md shadow-lg mt-2 p-1 min-w-[160px] border border-gray-200 z-[9999]"
      >
        {/* Profile Info */}
        <DropdownMenuItem
          disabled
          className="flex items-center px-2 py-1.5 rounded cursor-default"
        >
          <Avatar className="h-6 w-6 mr-2">
            <AvatarImage
              src={session?.user?.image || "/placeholder-user.jpg"}
              alt={session?.user?.name || "User"}
            />
            <AvatarFallback>
              {session?.user?.name?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <span>{session?.user?.name || "User"}</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-1 border-t border-gray-200" />

        {/* Logout Button (no logic yet) */}
        <DropdownMenuItem
          onClick={() => console.log("Logout clicked")}
          className="flex items-center px-2 py-1.5 rounded cursor-pointer hover:bg-red-100 text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    </header>
  );
}
