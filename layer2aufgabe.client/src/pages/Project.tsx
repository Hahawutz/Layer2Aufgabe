import React from 'react';
import ProjectList from '../components/ProjectList';
import useAutoLogout from '../hooks/useAutoLogout';

const Projects: React.FC = () => {
    useAutoLogout();
    return (
        <div className="Projects">
            <ProjectList />
        </div>
    );
};

export default Projects;
