import React, { useState, useMemo } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useData } from '../../hooks/useData';
import { VerificationDoc, UserProfile, VerificationStatus } from '../../types';
import { VERIFICATION_STATUSES } from '../../constants';

const ReviewModal: React.FC<{
    doc: VerificationDoc;
    student?: UserProfile;
    onClose: () => void;
    onUpdateStatus: (docId: string, status: VerificationStatus, remarks: string) => void;
}> = ({ doc, student, onClose, onUpdateStatus }) => {
    const [remarks, setRemarks] = useState(doc.remarks || '');

    const handleUpdate = (status: VerificationStatus) => {
        onUpdateStatus(doc.id, status, remarks);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-40 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6 w-full max-w-lg">
                <div className="flex justify-between items-start">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Review Document</h2>
                    <button onClick={onClose} className="text-2xl font-bold leading-none text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">&times;</button>
                </div>
                <div className="mt-4 space-y-4">
                    <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Student Name</p>
                        <p className="text-lg text-slate-800 dark:text-slate-200">{student?.name || 'Unknown'}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Program</p>
                        <p className="text-lg text-slate-800 dark:text-slate-200">{student?.studentProfile?.program || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Document</p>
                        <p className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">{doc.documentName}</p>
                    </div>
                    <div>
                        <label htmlFor="remarks" className="block text-sm font-medium text-slate-500 dark:text-slate-400">Remarks (Optional)</label>
                        <textarea
                            id="remarks"
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            rows={4}
                            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                            placeholder="Add feedback for the student..."
                        />
                    </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <button onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600">Cancel</button>
                    <button onClick={() => handleUpdate(VERIFICATION_STATUSES.REJECTED as VerificationStatus)} className="px-4 py-2 bg-rose-600 text-white font-semibold rounded-lg shadow-md hover:bg-rose-700">Reject</button>
                    <button onClick={() => handleUpdate(VERIFICATION_STATUSES.VERIFIED as VerificationStatus)} className="px-4 py-2 bg-emerald-600 text-white font-semibold rounded-lg shadow-md hover:bg-emerald-700">Approve</button>
                </div>
            </div>
        </div>
    );
};


const FacultyDashboard: React.FC = () => {
    const { verificationDocs, users, loading: isLoading, updateVerificationStatus } = useData();
    const [reviewingDoc, setReviewingDoc] = useState<VerificationDoc | null>(null);
    const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');

    if (isLoading) {
        return <p>Loading verification queue...</p>
    }

    const pendingDocs = useMemo(() => verificationDocs.filter(d => d.status === VERIFICATION_STATUSES.PENDING), [verificationDocs]);
    const historyDocs = useMemo(() => verificationDocs.filter(d => d.status !== VERIFICATION_STATUSES.PENDING).sort((a,b) => new Date(b.updatedAt || '').getTime() - new Date(a.updatedAt || '').getTime()), [verificationDocs]);

    const getStatusColor = (status: VerificationStatus) => {
        switch (status) {
            case VERIFICATION_STATUSES.VERIFIED: return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300';
            case VERIFICATION_STATUSES.REJECTED: return 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300';
            default: return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
        }
    };
    
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Verification Dashboard</h1>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg">
                <div className="border-b border-slate-200 dark:border-slate-700">
                    <nav className="-mb-px flex space-x-6 px-6" aria-label="Tabs">
                        <button
                            onClick={() => setActiveTab('pending')}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'pending'
                                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:border-slate-600'
                            }`}
                        >
                            Pending Queue <span className="ml-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900 px-2.5 py-1 text-xs font-semibold text-indigo-800 dark:text-indigo-200">{pendingDocs.length}</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'history'
                                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:border-slate-600'
                            }`}
                        >
                           Verification History
                        </button>
                    </nav>
                </div>

                <div className="p-6">
                    {activeTab === 'pending' && (
                        <div>
                            {pendingDocs.length > 0 ? (
                                <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                                    {pendingDocs.map(doc => {
                                        const student = users.find(u => u.id === doc.userId);
                                        return (
                                            <li key={doc.id} className="py-3 flex justify-between items-center">
                                                <div>
                                                    <p className="font-semibold text-slate-700 dark:text-slate-200">{doc.documentName}</p>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400">Submitted by: {student?.name || 'Unknown Student'}</p>
                                                </div>
                                                <button onClick={() => setReviewingDoc(doc)} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                                                    Review
                                                </button>
                                            </li>
                                        )
                                    })}
                                </ul>
                            ) : (
                                <p className="text-slate-500 dark:text-slate-400 text-center py-8">The verification queue is empty.</p>
                            )}
                        </div>
                    )}

                    {activeTab === 'history' && (
                        <div>
                            {historyDocs.length > 0 ? (
                                <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                                    {historyDocs.map(doc => {
                                        const student = users.find(u => u.id === doc.userId);
                                        return (
                                            <li key={doc.id} className="py-3 flex justify-between items-center">
                                                <div>
                                                    <p className="font-semibold text-slate-700 dark:text-slate-200">{doc.documentName}</p>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400">Submitted by: {student?.name || 'Unknown'}</p>
                                                    <p className="text-xs text-slate-400 italic mt-1">Reviewed on: {doc.updatedAt ? new Date(doc.updatedAt).toLocaleDateString() : 'N/A'}</p>
                                                </div>
                                                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusColor(doc.status)}`}>
                                                    {doc.status}
                                                </span>
                                            </li>
                                        )
                                    })}
                                </ul>
                            ) : (
                                <p className="text-slate-500 dark:text-slate-400 text-center py-8">No verification history found.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {reviewingDoc && (
                <ReviewModal 
                    doc={reviewingDoc}
                    student={users.find(u => u.id === reviewingDoc.userId)}
                    onClose={() => setReviewingDoc(null)}
                    onUpdateStatus={updateVerificationStatus}
                />
            )}
        </div>
    );
};

export default FacultyDashboard;