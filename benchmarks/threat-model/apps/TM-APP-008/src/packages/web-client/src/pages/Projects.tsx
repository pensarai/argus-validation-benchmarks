import React, { useState } from 'react';
import { useProjects, useCreateProject } from '../api/hooks/useProjects';
import { generateSlug } from '@app/shared-types';
import ProjectCard from '../components/ProjectCard';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Projects(): React.ReactElement {
  const { data: projects, isLoading } = useProjects();
  const createProject = useCreateProject();
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'date'>('date');

  if (isLoading) return <LoadingSpinner />;

  const items = (projects?.items || [])
    .filter((p: any) => !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a: any, b: any) => sortBy === 'name' ? a.name.localeCompare(b.name) : new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const handleCreate = async () => {
    try {
      await createProject.mutateAsync({ name, slug, description: description || undefined, organizationId: '' });
      setShowCreate(false);
    } catch {}
  };

  return (
    <div className="projects-page">
      <div className="page-header">
        <h1>Projects</h1>
        <button className="btn btn-primary" onClick={() => setShowCreate(true)}>New Project</button>
      </div>
      <div className="filters-bar">
        <input placeholder="Search projects..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="search-input" />
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
          <option value="date">Sort by date</option>
          <option value="name">Sort by name</option>
        </select>
      </div>
      <div className="project-grid">
        {items.map((project: any) => (
          <ProjectCard key={project.id} id={project.id} name={project.name} description={project.description} taskCount={project._count?.tasks || 0} doneCount={0} memberCount={0} updatedAt={project.updatedAt} />
        ))}
      </div>
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create Project">
        <div className="form-group"><label>Name</label><input value={name} onChange={(e) => { setName(e.target.value); setSlug(generateSlug(e.target.value)); }} /></div>
        <div className="form-group"><label>Slug</label><input value={slug} onChange={(e) => setSlug(e.target.value)} /></div>
        <div className="form-group"><label>Description</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} /></div>
        <button className="btn btn-primary" onClick={handleCreate}>{createProject.isPending ? 'Creating...' : 'Create'}</button>
      </Modal>
    </div>
  );
}
