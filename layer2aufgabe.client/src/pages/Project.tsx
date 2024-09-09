import React from 'react';
import ProjectList from '../components/ProjectList';
import ProjectFormModal from '../components/ProjectFormModal';
import useAutoLogout from '../hooks/useAutoLogout';

const Projects: React.FC = () => {
    useAutoLogout();
    return (
        <div className="Projects">
            <ProjectFormModal />
            <ProjectList />
        </div>
    );
};

export default Projects;
