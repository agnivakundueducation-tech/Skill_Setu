import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../../context/AuthContext';
import {
  VaultDocument,
  DocumentCategory,
  DOCUMENT_CATEGORIES,
  DocumentVerificationStatus,
  DocumentFilterOptions
} from '../../../types/document';
import { documentService } from '../../../services/documentService';
import { storageService } from '../../../services/storageService';
import { UploadDocumentModal } from './UploadDocumentModal';
import { DocumentDetailsModal } from './DocumentDetailsModal';
import { DeleteDocumentModal } from './DeleteDocumentModal';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import {
  FileText,
  Award,
  FileCheck,
  BookOpen,
  FolderArchive,
  Sparkles,
  ShieldCheck,
  UploadCloud,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Download,
  Trash2,
  Eye,
  LayoutGrid,
  List,
  HardDrive,
  Lock,
  Tag,
  Building2,
  ExternalLink,
  ChevronDown,
  Info
} from 'lucide-react';

const CATEGORY_ICONS: Record<DocumentCategory, React.ComponentType<{ className?: string }>> = {
  'Resume': FileText,
  'Certificates': Award,
  'Internship Reports': FileCheck,
  'Academic Records': BookOpen,
  'Project Evidence': Sparkles,
  'Other Supporting Documents': FolderArchive
};

const CATEGORY_COLORS: Record<DocumentCategory, { bg: string; text: string; border: string }> = {
  'Resume': { bg: 'bg-blue-50 dark:bg-blue-950/40', text: 'text-blue-700 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800/60' },
  'Certificates': { bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800/60' },
  'Internship Reports': { bg: 'bg-purple-50 dark:bg-purple-950/40', text: 'text-purple-700 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-800/60' },
  'Academic Records': { bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800/60' },
  'Project Evidence': { bg: 'bg-indigo-50 dark:bg-indigo-950/40', text: 'text-indigo-700 dark:text-indigo-400', border: 'border-indigo-200 dark:border-indigo-800/60' },
  'Other Supporting Documents': { bg: 'bg-slate-50 dark:bg-slate-900', text: 'text-slate-700 dark:text-slate-300', border: 'border-slate-200 dark:border-slate-800' }
};

export const DocumentVaultView: React.FC = () => {
  const { user, appUser, isAuthenticated, isDemo } = useAuth();
  const [documents, setDocuments] = useState<VaultDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | 'All'>('All');
  const [selectedStatus, setSelectedStatus] = useState<DocumentVerificationStatus | 'All'>('All');
  const [sortBy, setSortBy] = useState<'uploadedAt' | 'fileName' | 'fileSize'>('uploadedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedDocDetails, setSelectedDocDetails] = useState<VaultDocument | null>(null);
  const [docToDelete, setDocToDelete] = useState<VaultDocument | null>(null);

  const ownerId = (isAuthenticated && !isDemo && appUser?.uid) ? appUser.uid : (user?.id || 'demo-student-id');
  const isDemoActive = isDemo || !isAuthenticated;
  const isStorageLive = storageService.isLiveStorageAvailable();

  // Load documents
  const loadDocuments = async () => {
    setIsLoading(true);
    try {
      const res = await documentService.getStudentDocuments(
        ownerId,
        {
          category: selectedCategory,
          verificationStatus: selectedStatus,
          searchQuery,
          sortBy,
          sortDirection
        },
        isDemoActive
      );
      if (res.success && res.data) {
        setDocuments(res.data);
      }
    } catch (err) {
      console.error('[DocumentVaultView] Error fetching documents:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, [ownerId, selectedCategory, selectedStatus, searchQuery, sortBy, sortDirection, isDemoActive]);

  // Overall counts and stats
  const stats = useMemo(() => {
    const total = documents.length;
    const verified = documents.filter((d) => d.verificationStatus === 'Verified').length;
    const pending = documents.filter((d) => d.verificationStatus === 'Pending Verification').length;
    const totalBytes = documents.reduce((acc, d) => acc + (d.fileSize || 0), 0);
    const formattedStorage =
      totalBytes >= 1024 * 1024
        ? `${(totalBytes / (1024 * 1024)).toFixed(2)} MB`
        : `${(totalBytes / 1024).toFixed(1)} KB`;

    return { total, verified, pending, totalBytes, formattedStorage };
  }, [documents]);

  // Counts by category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: documents.length };
    DOCUMENT_CATEGORIES.forEach((cat) => {
      counts[cat] = documents.filter((d) => d.category === cat).length;
    });
    return counts;
  }, [documents]);

  const handleDocumentUploaded = (newDoc: VaultDocument) => {
    setDocuments((prev) => [newDoc, ...prev]);
  };

  const handleConfirmDelete = async (doc: VaultDocument) => {
    await documentService.deleteDocument(doc.id, doc.ownerId, isDemoActive);
    setDocuments((prev) => prev.filter((d) => d.id !== doc.id));
    if (selectedDocDetails?.id === doc.id) {
      setSelectedDocDetails(null);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
    return `${Math.round(bytes / 1024)} KB`;
  };

  const formatDate = (isoString: string): string => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return isoString;
    }
  };

  const renderStatusBadge = (status: DocumentVerificationStatus) => {
    switch (status) {
      case 'Verified':
        return (
          <Badge variant="success" size="sm" className="flex items-center gap-1 font-semibold">
            <ShieldCheck className="w-3 h-3" />
            Verified
          </Badge>
        );
      case 'Pending Verification':
        return (
          <Badge variant="warning" size="sm" className="flex items-center gap-1 font-semibold">
            <Clock className="w-3 h-3" />
            Pending Review
          </Badge>
        );
      case 'Rejected':
        return (
          <Badge variant="danger" size="sm" className="flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            Rejected
          </Badge>
        );
      case 'Unverified':
      default:
        return (
          <Badge variant="secondary" size="sm" className="flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Unverified
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-200 text-xs font-bold uppercase tracking-wider border border-indigo-400/30 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-indigo-300" />
                SIH Problem Statement 26044 • Secure Vault
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Secure Document Vault & Evidence
            </h1>
            <p className="text-sm text-indigo-200/90 leading-relaxed">
              Unified, tamper-evident repository for resumes, accredited credentials, internship milestone reports, university transcripts, and technical project proofs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={() => setIsUploadOpen(true)}
              className="bg-white text-indigo-950 hover:bg-indigo-50 font-bold shadow-lg shadow-indigo-950/50 flex items-center gap-2"
            >
              <UploadCloud className="w-4 h-4 text-indigo-600" />
              Upload Document
            </Button>
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-indigo-800/60">
          <div className="p-3 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
            <div className="text-indigo-200 text-xs font-medium">Total Documents</div>
            <div className="text-2xl font-bold text-white mt-1">{stats.total}</div>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
            <div className="text-emerald-300 text-xs font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Credentials
            </div>
            <div className="text-2xl font-bold text-white mt-1">{stats.verified}</div>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
            <div className="text-amber-300 text-xs font-medium flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              Pending Review
            </div>
            <div className="text-2xl font-bold text-white mt-1">{stats.pending}</div>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
            <div className="text-indigo-200 text-xs font-medium flex items-center gap-1">
              <HardDrive className="w-3.5 h-3.5" />
              Vault Storage
            </div>
            <div className="text-xl font-bold text-white mt-1 font-mono">{stats.formattedStorage}</div>
          </div>
        </div>
      </div>

      {/* Honest Storage Availability Banner if live storage is unconfigured */}
      {!isStorageLive && !isDemoActive && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 dark:text-amber-200">
            <span className="font-bold text-sm block">Document Storage Unavailable in Live Mode</span>
            <p className="mt-0.5 leading-relaxed text-amber-800 dark:text-amber-300">
              Firebase Storage bucket configuration (<code className="font-mono bg-amber-100 dark:bg-amber-900/60 px-1 py-0.5 rounded">VITE_FIREBASE_STORAGE_BUCKET</code>) is not detected. New cloud file uploads are currently paused until storage is connected. Existing metadata and demo sandbox records remain fully accessible.
            </p>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          {/* Search input */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by file name, issuing body, or keyword tag..."
              className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="All">All Verification Statuses</option>
              <option value="Verified">Verified Only</option>
              <option value="Pending Verification">Pending Review</option>
              <option value="Unverified">Unverified</option>
              <option value="Rejected">Rejected</option>
            </select>

            {/* Sort Filter */}
            <select
              value={`${sortBy}-${sortDirection}`}
              onChange={(e) => {
                const [sb, sd] = e.target.value.split('-');
                setSortBy(sb as any);
                setSortDirection(sd as any);
              }}
              className="text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="uploadedAt-desc">Newest First</option>
              <option value="uploadedAt-asc">Oldest First</option>
              <option value="fileName-asc">Name (A-Z)</option>
              <option value="fileName-desc">Name (Z-A)</option>
              <option value="fileSize-desc">Largest Size</option>
              <option value="fileSize-asc">Smallest Size</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden p-0.5 bg-slate-100 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory('All')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              selectedCategory === 'All'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
            }`}
          >
            All Categories
            <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${selectedCategory === 'All' ? 'bg-indigo-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
              {categoryCounts.All || 0}
            </span>
          </button>

          {DOCUMENT_CATEGORIES.map((cat) => {
            const Icon = CATEGORY_ICONS[cat];
            const isSelected = selectedCategory === cat;
            const count = categoryCounts[cat] || 0;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {cat}
                <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${isSelected ? 'bg-indigo-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Documents Grid / List */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-medium text-slate-500">Decrypting & loading vault evidence...</p>
        </div>
      ) : documents.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
            <FolderArchive className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              No Documents in this Category
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {searchQuery
                ? `No documents found matching "${searchQuery}". Try changing your search query or filters.`
                : 'Upload your verified resumes, capstone deliverables, transcripts, or credentials to store them securely.'}
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsUploadOpen(true)}
            className="inline-flex items-center gap-1.5"
          >
            <UploadCloud className="w-4 h-4" />
            Upload First Document
          </Button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => {
            const Icon = CATEGORY_ICONS[doc.category] || FileText;
            const colors = CATEGORY_COLORS[doc.category] || CATEGORY_COLORS['Other Supporting Documents'];

            return (
              <div
                key={doc.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  {/* Category & Status Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border flex items-center gap-1.5 ${colors.bg} ${colors.text} ${colors.border}`}>
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      {doc.category}
                    </span>
                    {renderStatusBadge(doc.verificationStatus)}
                  </div>

                  {/* Document Name */}
                  <div>
                    <h3
                      onClick={() => setSelectedDocDetails(doc)}
                      className="text-sm font-bold text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer line-clamp-2 transition-colors"
                      title={doc.fileName}
                    >
                      {doc.fileName}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400 font-mono">
                      <span>{formatFileSize(doc.fileSize)}</span>
                      <span>•</span>
                      <span>{formatDate(doc.uploadedAt)}</span>
                    </div>
                  </div>

                  {/* Linked Context if any */}
                  {doc.relatedContext?.title && (
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs space-y-0.5">
                      <div className="font-semibold text-slate-800 dark:text-slate-200 truncate flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                        {doc.relatedContext.title}
                      </div>
                      {doc.relatedContext.organization && (
                        <div className="text-[11px] text-slate-500 truncate">
                          {doc.relatedContext.organization}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tags */}
                  {doc.tags && doc.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {doc.tags.slice(0, 3).map((t, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                          {t}
                        </span>
                      ))}
                      {doc.tags.length > 3 && (
                        <span className="text-[10px] px-1.5 py-0.5 text-slate-400 font-medium">
                          +{doc.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Card footer actions */}
                <div className="flex items-center justify-between pt-3 mt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setSelectedDocDetails(doc)}
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Details
                  </button>

                  <div className="flex items-center gap-1">
                    {doc.downloadUrl && (
                      <button
                        type="button"
                        onClick={() => window.open(doc.downloadUrl, '_blank', 'noopener,noreferrer')}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors"
                        title="Open/Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setDocToDelete(doc)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                      title="Delete document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {documents.map((doc) => {
              const Icon = CATEGORY_ICONS[doc.category] || FileText;
              return (
                <div
                  key={doc.id}
                  className="p-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4
                        onClick={() => setSelectedDocDetails(doc)}
                        className="text-sm font-bold text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer truncate"
                      >
                        {doc.fileName}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 mt-0.5 text-xs text-slate-400">
                        <span className="font-semibold text-slate-600 dark:text-slate-300">{doc.category}</span>
                        <span>•</span>
                        <span className="font-mono">{formatFileSize(doc.fileSize)}</span>
                        <span>•</span>
                        <span>{formatDate(doc.uploadedAt)}</span>
                        {doc.relatedContext?.title && (
                          <>
                            <span>•</span>
                            <span className="text-indigo-600 dark:text-indigo-400 truncate max-w-[200px]">
                              {doc.relatedContext.title}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    {renderStatusBadge(doc.verificationStatus)}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedDocDetails(doc)}
                      className="text-xs"
                    >
                      View
                    </Button>
                    {doc.downloadUrl && (
                      <button
                        type="button"
                        onClick={() => window.open(doc.downloadUrl, '_blank', 'noopener,noreferrer')}
                        className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setDocToDelete(doc)}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modals */}
      <UploadDocumentModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSuccess={handleDocumentUploaded}
        defaultCategory={selectedCategory !== 'All' ? selectedCategory : 'Resume'}
      />

      <DocumentDetailsModal
        isOpen={Boolean(selectedDocDetails)}
        onClose={() => setSelectedDocDetails(null)}
        document={selectedDocDetails}
        onDeleteRequest={(doc) => {
          setSelectedDocDetails(null);
          setDocToDelete(doc);
        }}
      />

      <DeleteDocumentModal
        isOpen={Boolean(docToDelete)}
        onClose={() => setDocToDelete(null)}
        document={docToDelete}
        onConfirmDelete={handleConfirmDelete}
      />
    </div>
  );
};
export default DocumentVaultView;
