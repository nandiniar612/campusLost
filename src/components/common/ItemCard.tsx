import React from 'react';
import { ItemReport } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  MapPin,
  Calendar,
  Eye,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Laptop,
  Briefcase,
  BookOpen,
  Shirt,
  Sparkles,
  CreditCard,
  Key,
  Package
} from 'lucide-react';

interface ItemCardProps {
  item: ItemReport;
  onView?: (item: ItemReport) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, onView }) => {
  const { setCurrentView } = useApp();

  const handleCardClick = () => {
    if (onView) {
      onView(item);
    } else {
      setCurrentView('item-details', item.id);
    }
  };

  const isLost = item.type === 'lost';

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Electronics':
        return <Laptop className="w-3.5 h-3.5" />;
      case 'Bags & Wallets':
        return <Briefcase className="w-3.5 h-3.5" />;
      case 'Books & Stationery':
        return <BookOpen className="w-3.5 h-3.5" />;
      case 'Clothing':
        return <Shirt className="w-3.5 h-3.5" />;
      case 'Accessories':
        return <Sparkles className="w-3.5 h-3.5" />;
      case 'ID Cards':
        return <CreditCard className="w-3.5 h-3.5" />;
      case 'Keys':
        return <Key className="w-3.5 h-3.5" />;
      default:
        return <Package className="w-3.5 h-3.5" />;
    }
  };

  const getStatusBadge = () => {
    switch (item.status) {
      case 'Resolved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Resolved
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" /> In Progress
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-800 border border-red-200">
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <Clock className="w-3 h-3 text-blue-600" /> Pending
          </span>
        );
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="group bg-white rounded-2xl border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 overflow-hidden flex flex-col cursor-pointer"
    >
      {/* Image Thumbnail with Overlay Badges */}
      <div className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden">
        <img
          src={item.photoUrl || item.image}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span
            className={`px-3 py-1 rounded-full text-xs font-black tracking-wide uppercase shadow-sm ${
              isLost
                ? 'bg-rose-600 text-white'
                : 'bg-emerald-600 text-white'
            }`}
          >
            {isLost ? 'Lost' : 'Found'}
          </span>

          {getStatusBadge()}
        </div>

        {/* Suspicious warning if flagged */}
        {item.suspiciousFlag && (
          <div className="absolute bottom-2 left-2 bg-amber-500/90 backdrop-blur-xs text-white text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Flagged for Review
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category Chip */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md w-fit mb-2">
            {getCategoryIcon(item.category)}
            <span>{item.category}</span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 text-base">
            {item.title}
          </h3>

          {/* Description snippet */}
          <p className="text-xs text-stone-500 line-clamp-2 mt-1 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Metadata: Location & Date */}
        <div className="pt-2 border-t border-stone-100 space-y-1.5 text-xs text-stone-600">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
            <span className="truncate">{item.location}</span>
          </div>

          <div className="flex items-center justify-between text-stone-400 text-[11px]">
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{item.date}</span>
            </div>

            <button
              type="button"
              className="text-xs font-bold text-indigo-600 group-hover:text-indigo-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
            >
              <Eye className="w-3.5 h-3.5" /> View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
