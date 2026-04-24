'use client';

import Link from 'next/link';
import { useData } from '@/context/DataContext';
import Icon from '@/components/ui/Icon';

/**
 * ClientCard component
 * @description Renders information about a specific client.
 * Now links to the client detail page.
 */
const ClientCard = ({ id, name, email, company, initials, colorClass = 'bg-indigo-500/30 border-indigo-400/20' }) => {
  const { deleteClient, updateClient } = useData();

  const handleEdit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const newName = prompt('Enter new name:', name);
    if (newName && newName !== name) {
      const { success, error } = await updateClient(id, { name: newName });
      if (!success) alert('Error updating client: ' + error);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      const { success, error } = await deleteClient(id);
      if (!success) alert('Error deleting client: ' + error);
    }
  };

  return (
    <div className="group relative surface-card rounded-[20px] transition-all duration-500 hover:bg-white/[0.08] hover:-translate-y-2 overflow-hidden shadow-lg shadow-black/20">
      <Link href={`/clients/${id}`} className="block p-8">
        {/* Card Header: Avatar and Actions */}
        <div className="flex items-start justify-between">
          {/* Client Avatar / Initials */}
          <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg text-[var(--color-on-surface)] border ${colorClass}`}>
            {initials}
          </div>

          {/* Contextual Actions (visible on hover) */}
          {/* Note: We stop propagation to allow Link to work on the rest of the card */}
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 relative z-10" onClick={(e) => e.preventDefault()}>
            <button
              type="button"
              className="w-10 h-10 rounded-full surface-card flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
              title="Edit Client"
              onClick={handleEdit}
            >
              <Icon name="edit" size="sm" />
            </button>
            <button
              type="button"
              className="w-10 h-10 rounded-full surface-card flex items-center justify-center text-on-surface-variant hover:text-[var(--color-on-surface)]rror transition-colors"
              title="Delete Client"
              onClick={handleDelete}
            >
              <Icon name="delete" size="sm" />
            </button>
          </div>
        </div>

        {/* Client Info Section */}
        <div className="mt-8">
          <h3 className="font-body text-xl font-semibold text-[var(--color-on-surface)]">{name}</h3>
          <p className="font-body text-sm text-on-surface-variant/60 mt-1">{company}</p>

          <div className="flex items-center gap-2 mt-6 text-on-surface-variant/40">
            <Icon name="mail" size="sm" />
            <span className="font-label text-sm tracking-tight">{email}</span>
          </div>
        </div>
      </Link>

      {/* Ambient Glow on hover */}
      <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-indigo-500/10  rounded-full group-hover:bg-indigo-500/20 transition-colors pointer-events-none" />
    </div>
  );
};

export default ClientCard;
