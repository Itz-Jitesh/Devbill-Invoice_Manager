import ClientCard from './ClientCard';

/**
 * ClientGrid component
 * @description Renders a responsive grid of ClientCard components,
 * including a special dashed card for adding a new client.
 * No hooks — pure layout.
 */
const ClientGrid = ({ clients, onAddClient }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {/* Existing Client Cards */}
      {clients.map((client) => {
        const initials = client.initials || (client.name ? client.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '??');
        const colorClass = client.colorClass || 'bg-primary/20 border-primary/10';
        
        return (
          <ClientCard
            key={client._id}
            id={client._id}
            name={client.name || 'Unknown Client'}
            email={client.email || 'No email'}
            company={client.company || 'Private'}
            initials={initials}
            colorClass={colorClass}
          />
        );
      })}

      {/* "New Client" Dashed Card */}
      <button
        type="button"
        onClick={onAddClient}
        className="group flex flex-col items-center justify-center rounded-[20px] border-2 border-dashed border-white/10 p-8 hover:border-primary/40 transition-all duration-300 bg-transparent hover:bg-primary/[0.02]"
      >
        <div className="w-12 h-12 rounded-full glass-card flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <span className="material-symbols-outlined text-primary">add</span>
        </div>
        <p className="font-label text-sm font-medium text-on-surface-variant/60 group-hover:text-primary">
          New Client
        </p>
      </button>
    </div>
  );
};

export default ClientGrid;
