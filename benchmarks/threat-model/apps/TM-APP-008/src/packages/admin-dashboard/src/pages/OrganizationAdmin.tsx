import React from 'react';
import { useAllOrganizations, useSuspendOrganization } from '../api/hooks/useOrganizations';
import DataTable from '../components/DataTable';

export default function OrganizationAdmin(): React.ReactElement {
  const { data: orgs, isLoading } = useAllOrganizations();
  const suspendOrg = useSuspendOrganization();

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'slug', label: 'Slug', sortable: true },
    { key: 'memberIds', label: 'Members', render: (v: string[]) => v?.length || 0 },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: any) => (
        <button className="btn-sm btn-danger" onClick={() => suspendOrg.mutate({ orgId: row.id, suspended: true })}>
          Suspend
        </button>
      ),
    },
  ];

  return (
    <div className="org-admin-page">
      <h1>Organization Administration</h1>
      <p className="subtitle">View and manage all organizations on the platform</p>
      <DataTable columns={columns} data={Array.isArray(orgs) ? orgs : []} loading={isLoading} />
    </div>
  );
}
