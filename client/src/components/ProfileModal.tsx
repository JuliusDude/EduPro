import { X, Camera, Mail, Phone, Hash, Calendar, MapPin, Edit2 } from 'lucide-react';
import { useState, useRef } from 'react';

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ProfileModal = ({ isOpen, onClose }: ProfileModalProps) => {
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [profileData, setProfileData] = useState({
        firstName: 'John',
        lastName: 'Doe',
        studentId: 'CS2024001',
        email: 'john.doe@university.edu',
        phone: '+1 (555) 123-4567',
        department: 'Computer Science',
        semester: '6th Semester',
        enrollmentYear: '2021',
        dateOfBirth: '2003-05-15',
        address: '123 University Ave, Campus City, ST 12345'
    });

    if (!isOpen) return null;

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        console.log('Saving profile data:', profileData);
        setIsEditing(false);
    };

    return (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl border border-slate-200 dark:border-slate-800 transition-colors duration-300 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 p-6 z-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Profile</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your personal information</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Profile Picture Section */}
                    <div className="flex flex-col items-center">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold overflow-hidden">
                                {profileImage ? (
                                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <span>{profileData.firstName[0]}{profileData.lastName[0]}</span>
                                )}
                            </div>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute bottom-0 right-0 p-2.5 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-colors group-hover:scale-110 duration-200"
                            >
                                <Camera className="w-4 h-4" />
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </div>
                        <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
                            {profileData.firstName} {profileData.lastName}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{profileData.department}</p>
                    </div>

                    {/* Edit Toggle */}
                    <div className="flex justify-end">
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 px-4 py-2 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors"
                            >
                                <Edit2 className="w-4 h-4" />
                                Edit Profile
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    Save Changes
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Information Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Student ID */}
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs mb-1">
                                <Hash className="w-3.5 h-3.5" />
                                Student ID
                            </div>
                            <p className="text-slate-900 dark:text-white font-semibold">{profileData.studentId}</p>
                        </div>

                        {/* Email */}
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs mb-1">
                                <Mail className="w-3.5 h-3.5" />
                                Email Address
                            </div>
                            {isEditing ? (
                                <input
                                    type="email"
                                    value={profileData.email}
                                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-sm text-slate-900 dark:text-white"
                                />
                            ) : (
                                <p className="text-slate-900 dark:text-white font-semibold text-sm">{profileData.email}</p>
                            )}
                        </div>

                        {/* Phone */}
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs mb-1">
                                <Phone className="w-3.5 h-3.5" />
                                Phone Number
                            </div>
                            {isEditing ? (
                                <input
                                    type="tel"
                                    value={profileData.phone}
                                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-sm text-slate-900 dark:text-white"
                                />
                            ) : (
                                <p className="text-slate-900 dark:text-white font-semibold">{profileData.phone}</p>
                            )}
                        </div>

                        {/* Date of Birth */}
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs mb-1">
                                <Calendar className="w-3.5 h-3.5" />
                                Date of Birth
                            </div>
                            {isEditing ? (
                                <input
                                    type="date"
                                    value={profileData.dateOfBirth}
                                    onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
                                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-sm text-slate-900 dark:text-white"
                                />
                            ) : (
                                <p className="text-slate-900 dark:text-white font-semibold">{new Date(profileData.dateOfBirth).toLocaleDateString()}</p>
                            )}
                        </div>

                        {/* Department */}
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs mb-1">
                                Department
                            </div>
                            <p className="text-slate-900 dark:text-white font-semibold">{profileData.department}</p>
                        </div>

                        {/* Semester */}
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs mb-1">
                                Current Semester
                            </div>
                            <p className="text-slate-900 dark:text-white font-semibold">{profileData.semester}</p>
                        </div>

                        {/* Enrollment Year */}
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs mb-1">
                                Enrollment Year
                            </div>
                            <p className="text-slate-900 dark:text-white font-semibold">{profileData.enrollmentYear}</p>
                        </div>
                    </div>

                    {/* Address */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs mb-2">
                            <MapPin className="w-3.5 h-3.5" />
                            Address
                        </div>
                        {isEditing ? (
                            <textarea
                                value={profileData.address}
                                onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                                rows={2}
                                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white resize-none"
                            />
                        ) : (
                            <p className="text-slate-900 dark:text-white">{profileData.address}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileModal;
