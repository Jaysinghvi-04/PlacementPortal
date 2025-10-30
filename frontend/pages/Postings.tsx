import React, { useState, useMemo } from 'react';
import { useData } from '../hooks/useData';
import { useAuth } from '../hooks/useAuth';
import { Posting, Skill, VerificationStatus } from '../types';
import Pagination from '../components/common/Pagination';

const ITEMS_PER_PAGE = 6;

const JobDetailModal: React.FC<{ posting: Posting; onClose: () => void; isApplied: boolean; canApply: { value: boolean, reason: string } }> = ({ posting, onClose, isApplied, canApply }) => {
    const { skills, addApplication } = useData();
    const getSkillName = (id: string) => skills.find(s => s.id === id)?.name || id;

    const [isApplying, setIsApplying] = useState(false);
    const [coverLetter, setCoverLetter] = useState('');

    const handleApplyClick = () => {
        setIsApplying(true);
    };

    const handleCancelApply = () => {
        setIsApplying(false);
        setCoverLetter('');
    };

    const handleSubmitApplication = async () => {
        await addApplication(posting.id, coverLetter);
        onClose();
    };


    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-40 flex justify-center items-center p-4 transition-opacity">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{posting.title}</h2>
                        <p className="text-lg text-slate-600 dark:text-slate-300">{posting.company}</p>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700">&times;</button>
                </div>

                {isApplying ? (
                    <div className="mt-4 space-y-4">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Your Cover Letter</h3>
                        <textarea 
                            value={coverLetter} 
                            onChange={e => setCoverLetter(e.target.value)} 
                            rows={10} 
                            placeholder="Write your cover letter here..." 
                            className="w-full p-3 border rounded-md dark:bg-slate-700 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-200"
                        />
                    </div>
                ) : (
                    <div className="mt-4 space-y-4 text-slate-700 dark:text-slate-300">
                        <p><strong>Location:</strong> {posting.location}</p>
                        <p><strong>Type:</strong> {posting.type}</p>
                        <p><strong>Salary:</strong> {posting.salary}</p>
                        <p><strong>Deadline:</strong> {new Date(posting.deadline).toLocaleDateString()}</p>
                        <p><strong>Description:</strong> {posting.description}</p>
                        <div>
                            <strong>Required Skills:</strong>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {posting.requiredSkills.map(id => <span key={id} className="px-2.5 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full dark:bg-indigo-900 dark:text-indigo-300">{getSkillName(id)}</span>)}
                            </div>
                        </div>
                         <div>
                            <strong>Eligibility:</strong>
                            <ul className="list-disc list-inside">
                                <li>Minimum GPA: {posting.eligibility.minGpa}</li>
                                <li>Graduation Year(s): {posting.eligibility.gradYear.join(', ')}</li>
                                 {posting.requiresVerification && <li className="text-amber-600 dark:text-amber-400"><strong>Requires document verification.</strong></li>}
                            </ul>
                        </div>
                    </div>
                )}
                <div className="mt-6 flex justify-end space-x-3">
                    {isApplying ? (
                         <>
                            <button onClick={handleCancelApply} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600">Cancel</button>
                            <button onClick={handleSubmitApplication} className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700">Submit Application</button>
                        </>
                    ) : (
                        <>
                            <button onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600">Close</button>
                            <div className="relative group">
                                <button 
                                    onClick={handleApplyClick} 
                                    disabled={isApplied || !canApply.value}
                                    className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed"
                                >
                                    {isApplied ? 'Applied' : 'Apply Now'}
                                </button>
                                {!canApply.value && <div className="absolute bottom-full mb-2 w-max px-3 py-1.5 text-xs text-white bg-slate-900 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">{canApply.reason}</div>}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

const PostingCard: React.FC<{ posting: Posting; onView: () => void; }> = ({ posting, onView }) => {
    const { skills } = useData();
    const getSkillName = (id: string) => skills.find(s => s.id === id)?.name || id;

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 flex flex-col justify-between transition-all transform hover:-translate-y-1 hover:shadow-2xl cursor-pointer" onClick={onView}>
            <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{posting.title}</h3>
                <p className="text-md text-slate-600 dark:text-slate-400">{posting.company}</p>
                <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    <span>{posting.location}</span> &middot; <span>{posting.type}</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-3">
                    {posting.requiredSkills.slice(0, 3).map(id => <span key={id} className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full dark:bg-slate-700 dark:text-slate-300">{getSkillName(id)}</span>)}
                </div>
            </div>
            <div className="mt-4 border-t pt-4 dark:border-slate-700 text-center text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                View Details
            </div>
        </div>
    );
};


const Postings: React.FC = () => {
    const { postings, skills, applications, verificationDocs, isLoading } = useData();
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [selectedSkill, setSelectedSkill] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [isRemoteOnly, setIsRemoteOnly] = useState(false);
    const [selectedPosting, setSelectedPosting] = useState<Posting | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const studentProfile = user?.studentProfile;
    const studentApplications = useMemo(() => applications.filter(a => a.studentId === user?.id), [applications, user]);
    const studentDocs = useMemo(() => verificationDocs.filter(d => d.studentId === user?.id), [verificationDocs, user]);
    
    const canStudentApply = (posting: Posting) => {
        if (!studentProfile) return { value: false, reason: 'Not a student.' };
        if (studentProfile.hasAcceptedOffer) return { value: false, reason: 'You have already accepted an offer.' };
        if (new Date(posting.deadline) < new Date()) return { value: false, reason: 'Application deadline has passed.' };
        if (posting.status === 'Closed') return { value: false, reason: 'This position is closed.' };
        if (studentProfile.gpa < posting.eligibility.minGpa) return { value: false, reason: `Requires minimum GPA of ${posting.eligibility.minGpa}.` };
        if (!posting.eligibility.gradYear.includes(studentProfile.gradYear)) return { value: false, reason: `Not open for your graduation year (${studentProfile.gradYear}).` };
        if (posting.requiresVerification && !studentDocs.every(d => d.status === 'verified')) {
            return { value: false, reason: 'Requires all documents to be verified.' };
        }
        return { value: true, reason: '' };
    };

    const clearFilters = () => {
        setSearchTerm('');
        setLocationFilter('');
        setSelectedSkill('');
        setTypeFilter('');
        setIsRemoteOnly(false);
    };

    const filteredPostings = useMemo(() => postings.filter(p => 
        p.status === 'Open' &&
        (p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.company.toLowerCase().includes(searchTerm.toLowerCase())) &&
        p.location.toLowerCase().includes(locationFilter.toLowerCase()) &&
        (selectedSkill === '' || p.requiredSkills.includes(selectedSkill)) &&
        (typeFilter === '' || p.type === typeFilter) &&
        (!isRemoteOnly || p.location.toLowerCase() === 'remote')
    ), [postings, searchTerm, locationFilter, selectedSkill, typeFilter, isRemoteOnly]);

    const paginatedPostings = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredPostings.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredPostings, currentPage]);

    const totalPages = Math.ceil(filteredPostings.length / ITEMS_PER_PAGE);

    const openDetailModal = (posting: Posting) => setSelectedPosting(posting);
    const closeModal = () => setSelectedPosting(null);
    
    if (isLoading) return <p>Loading postings...</p>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Job Postings</h1>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <input type="text" placeholder="Search title or company..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 w-full" />
                    <input type="text" placeholder="Filter by location..." value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} className="p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 w-full" />
                    <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 w-full">
                        <option value="">All Types</option>
                        <option value="Internship">Internship</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                    </select>
                    <select value={selectedSkill} onChange={(e) => setSelectedSkill(e.target.value)} className="p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 w-full">
                        <option value="">All Skills</option>
                        {skills.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                </div>
                <div className="flex flex-wrap items-center justify-between mt-4 pt-4 border-t dark:border-slate-700">
                    <div className="flex items-center">
                        <input id="remote-only" type="checkbox" checked={isRemoteOnly} onChange={(e) => setIsRemoteOnly(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                        <label htmlFor="remote-only" className="ml-2 block text-sm text-slate-900 dark:text-slate-300">
                            Remote Only
                        </label>
                    </div>
                    <button onClick={clearFilters} className="px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-700 rounded-md">
                        Reset Filters
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedPostings.length > 0 ? paginatedPostings.map(posting => (
                    <PostingCard key={posting.id} posting={posting} onView={() => openDetailModal(posting)} />
                )) : <p className="text-slate-500 dark:text-slate-400 md:col-span-3 text-center">No postings match the current filters.</p>}
            </div>

            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

            {selectedPosting && (
                <JobDetailModal 
                    posting={selectedPosting}
                    onClose={closeModal}
                    isApplied={studentApplications.some(a => a.jobId === selectedPosting.id)}
                    canApply={canStudentApply(selectedPosting)}
                />
            )}
        </div>
    );
};

export default Postings;