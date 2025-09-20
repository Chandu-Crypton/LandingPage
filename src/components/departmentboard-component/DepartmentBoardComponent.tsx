// 'use client';

// import React, { useState, useEffect } from 'react';
// import Input from '@/components/form/input/InputField';
// import Label from '@/components/form/Label';
// import ComponentCard from '@/components/common/ComponentCard';
// import { useRouter } from 'next/navigation';
// import Image from 'next/image';
// import axios from 'axios';

// interface BoardFormProps {
//   boardIdToEdit?: string;
// }

// interface IBoard {
//   _id?: string;
//   fullName: string;
//   role: string;
//   socialLink: string;
//   description: string;
//   mainImage?: string;
// }

// const DepartmentBoardFormComponent: React.FC<BoardFormProps> = ({ boardIdToEdit }) => {
//   const router = useRouter();

//   // States
//   const [fullName, setFullName] = useState('');
//   const [role, setRole] = useState('');
//   const [socialLink, setSocialLink] = useState('');
//   const [description, setDescription] = useState('');
//   const [mainImageFile, setMainImageFile] = useState<File | null>(null);
//   const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);

//   const [loading, setLoading] = useState(false);
//   const [formError, setFormError] = useState<string | null>(null);

//   // Fetch board if editing
//   useEffect(() => {
//     if (!boardIdToEdit) return;

//     const fetchBoard = async () => {
//       setLoading(true);
//       try {
//         const res = await axios.get<{ success: boolean; data?: IBoard; message?: string }>(
//           `/api/departmentboard/${boardIdToEdit}`
//         );
//         if (res.data.success && res.data.data) {
//           const data = res.data.data;
//           setFullName(data.fullName);
//           setRole(data.role);
//           setSocialLink(data.socialLink);
//           setDescription(data.description);
//           setMainImagePreview(data.mainImage || null);
//         } else {
//           setFormError(res.data.message || 'Board not found.');
//         }
//       } catch (err) {
//         console.error('Error fetching department board:', err);
//         setFormError('Failed to load board data for editing.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBoard();
//   }, [boardIdToEdit]);

//   // Handlers
//   const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0] || null;
//     setMainImageFile(file);
//     setMainImagePreview(file ? URL.createObjectURL(file) : null);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setFormError(null);
//     setLoading(true);

//     const formData = new FormData();
//     formData.append('fullName', fullName);
//     formData.append('role', role);
//     formData.append('socialLink', socialLink);
//     formData.append('description', description);

//     if (mainImageFile) {
//       formData.append('mainImage', mainImageFile);
//     }

//     try {
//       if (boardIdToEdit) {
//         await axios.put(`/api/departmentboard/${boardIdToEdit}`, formData);
//         alert('Board updated successfully!');
//       } else {
//         await axios.post(`/api/departmentboard`, formData);
//         alert('Board created successfully!');
//       }
//       router.push('/departmentboard-component/DepartmentBoard-List');
//     } catch (err) {
//       console.error('Submission failed:', err);
//       if (axios.isAxiosError(err)) {
//         setFormError(err.response?.data?.message || 'An error occurred during submission.');
//       } else if (err instanceof Error) {
//         setFormError(err.message || 'An unexpected error occurred.');
//       } else {
//         setFormError('An unknown error occurred. Please try again.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <ComponentCard title={boardIdToEdit ? 'Edit Department Board' : 'Add New Department Board'}>
//         {formError && <p className="text-red-500 text-center mb-4">{formError}</p>}
//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Full Name */}
//           <div>
//             <Label htmlFor="fullName">Full Name</Label>
//             <Input
//               id="fullName"
//               type="text"
//               value={fullName}
//               onChange={(e) => setFullName(e.target.value)}
//               required
//             />
//           </div>

//           {/* Role */}
//           <div>
//             <Label htmlFor="role">Role</Label>
//             <Input
//               id="role"
//               type="text"
//               value={role}
//               onChange={(e) => setRole(e.target.value)}
//               required
//             />
//           </div>

//           {/* Social Link */}
//           <div>
//             <Label htmlFor="socialLink">Social Link</Label>
//             <Input
//               id="socialLink"
//               type="text"
//               value={socialLink}
//               onChange={(e) => setSocialLink(e.target.value)}
//             />
//           </div>

//           {/* Description */}
//           <div>
//             <Label htmlFor="description">Description</Label>
//             <textarea
//               id="description"
//               className="w-full border rounded p-2"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               required
//             />
//           </div>

//           {/* Main Image */}
//           <div>
//             <Label htmlFor="mainImage">Main Image</Label>
//             {mainImagePreview && (
//               <div className="mb-2">
//                 <Image
//                   src={mainImagePreview}
//                   alt="Preview"
//                   width={300}
//                   height={200}
//                   className="rounded shadow"
//                   unoptimized
//                 />
//               </div>
//             )}
//             <input type="file" id="mainImage" accept="image/*" onChange={handleMainImageChange} />
//           </div>

//           {/* Submit */}
//           <div className="pt-4 flex justify-end">
//             <button
//               type="submit"
//               disabled={loading}
//               className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//             >
//               {loading ? 'Submitting...' : boardIdToEdit ? 'Update Board' : 'Add Board'}
//             </button>
//           </div>
//         </form>
//       </ComponentCard>
//     </div>
//   );
// };

// export default DepartmentBoardFormComponent;












'use client';

import React, { useState, useEffect } from 'react';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import ComponentCard from '@/components/common/ComponentCard';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';

interface BoardFormProps {
  boardIdToEdit?: string;
}

interface IBoard {
  _id?: string;
  fullName: string;
  role: string;
  socialLink: string;
  description: string;
  mainImage?: string;
}

const DepartmentBoardFormComponent: React.FC<BoardFormProps> = ({ boardIdToEdit }) => {
  const router = useRouter();

  // States
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('');
  const [socialLink, setSocialLink] = useState('');
  const [description, setDescription] = useState('');
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [newRole, setNewRole] = useState(''); // For adding new roles
  const [roles, setRoles] = useState<string[]>([]); // Available roles from API

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Fetch available roles from API
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get('/api/departmentboard');
        if (response.data.success && response.data.data) {
          // Extract unique roles from the board objects
          const uniqueRoles = Array.from(
            new Set(response.data.data.map((board: IBoard) => board.role).filter(Boolean))
          ) as string[];
          setRoles(uniqueRoles);
        }
      } catch (err) {
        console.error('Error fetching roles:', err);
        // If API fails, use a default set of roles
        setRoles(['Marketing', 'Flutter Developer', 'MERN Stack Developer', 'UI/UX Designer', 'Sales Executive', 'DevOps Engineer', 'Content Writer']);
      }
    };

    fetchRoles();
  }, []);

  // Fetch board if editing
  useEffect(() => {
    if (!boardIdToEdit) return;

    const fetchBoard = async () => {
      setLoading(true);
      try {
        const res = await axios.get<{ success: boolean; data?: IBoard; message?: string }>(
          `/api/departmentboard/${boardIdToEdit}`
        );
        if (res.data.success && res.data.data) {
          const data = res.data.data;
          setFullName(data.fullName);
          setRole(data.role);
          setSocialLink(data.socialLink);
          setDescription(data.description);
          setMainImagePreview(data.mainImage || null);
        } else {
          setFormError(res.data.message || 'Board not found.');
        }
      } catch (err) {
        console.error('Error fetching department board:', err);
        setFormError('Failed to load board data for editing.');
      } finally {
        setLoading(false);
      }
    };

    fetchBoard();
  }, [boardIdToEdit]);

  // Handlers
  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setMainImageFile(file);
    setMainImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const handleAddNewRole = () => {
    if (newRole.trim() && !roles.includes(newRole.trim())) {
      setRoles([...roles, newRole.trim()]);
      setRole(newRole.trim()); // Auto-select the newly added role
      setNewRole(''); // Clear the input field
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setLoading(true);

    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('role', role);
    formData.append('socialLink', socialLink);
    formData.append('description', description);

    if (mainImageFile) {
      formData.append('mainImage', mainImageFile);
    }

    try {
      if (boardIdToEdit) {
        await axios.put(`/api/departmentboard/${boardIdToEdit}`, formData);
        alert('Board updated successfully!');
      } else {
        await axios.post(`/api/departmentboard`, formData);
        alert('Board created successfully!');
      }
      router.push('/departmentboard-component/DepartmentBoard-List');
    } catch (err) {
      console.error('Submission failed:', err);
      if (axios.isAxiosError(err)) {
        setFormError(err.response?.data?.message || 'An error occurred during submission.');
      } else if (err instanceof Error) {
        setFormError(err.message || 'An unexpected error occurred.');
      } else {
        setFormError('An unknown error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ComponentCard title={boardIdToEdit ? 'Edit Department Board' : 'Add New Department Board'}>
        {formError && <p className="text-red-500 text-center mb-4">{formError}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          {/* Add New Role */}
          <div>
            <Label htmlFor="newRole">Add New Role (Optional)</Label>
            <div className="flex gap-2">
              <Input
                id="newRole"
                type="text"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                placeholder="Enter a new role"
              />
              <button
                type="button"
                onClick={handleAddNewRole}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 whitespace-nowrap"
              >
                Add Role
              </button>
            </div>
          </div>

          {/* Role Dropdown */}
          <div>
            <Label htmlFor="role">Role</Label>
            <select
              id="role"
              className="w-full border rounded p-2"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="">Select a role</option>
              {roles.map((roleOption) => (
                <option key={roleOption} value={roleOption}>
                  {roleOption}
                </option>
              ))}
            </select>
          </div>

          {/* Social Link */}
          <div>
            <Label htmlFor="socialLink">Social Link</Label>
            <Input
              id="socialLink"
              type="text"
              value={socialLink}
              onChange={(e) => setSocialLink(e.target.value)}
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              className="w-full border rounded p-2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
            />
          </div>

          {/* Main Image */}
          <div>
            <Label htmlFor="mainImage">Main Image</Label>
            {mainImagePreview && (
              <div className="mb-2">
                <Image
                  src={mainImagePreview}
                  alt="Preview"
                  width={300}
                  height={200}
                  className="rounded shadow"
                  unoptimized
                />
              </div>
            )}
            <input 
              type="file" 
              id="mainImage" 
              accept="image/*" 
              onChange={handleMainImageChange}
              className="w-full border rounded p-2"
            />
          </div>

          {/* Submit */}
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Submitting...' : boardIdToEdit ? 'Update Board' : 'Add Board'}
            </button>
          </div>
        </form>
      </ComponentCard>
    </div>
  );
};

export default DepartmentBoardFormComponent;