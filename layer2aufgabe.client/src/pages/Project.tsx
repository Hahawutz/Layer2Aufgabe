import React from 'react';
import ProjectList from '../components/ProjectList';
import ProjectFormModal from '../components/ProjectFormModal';

const Projects: React.FC = () => {
    return (
        <div className="Projects">
            <ProjectFormModal />
            <ProjectList />
        </div>
    );
};

export default Projects;
