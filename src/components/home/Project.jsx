import React, { useState, useEffect, useCallback } from "react";
import Container from "react-bootstrap/Container";
import { Jumbotron } from "./migration";
import Row from "react-bootstrap/Row";
import ProjectCard from "./ProjectCard";
import axios from "axios";

const dummyProject = {
  name: null,
  description: null,
  svn_url: null,
  stargazers_count: null,
  languages_url: null,
  pushed_at: null,
};

const API = "https://api.github.com";

const Project = ({ heading, username, length, specfic }) => {
  // NOTE: We intentionally do NOT use the "all repos" API anymore.
  // Only fetch repositories explicitly listed in `specfic`.
  const specficReposAPI = `${API}/repos/${username}`;

  const specificList = Array.isArray(specfic) ? specfic : [];
  const dummyProjectsArr = new Array(specificList.length).fill(dummyProject);

  const [projectsArray, setProjectsArray] = useState([]);

  const fetchRepos = useCallback(async () => {
    try {
      // Fetch ONLY the repos you listed, preserving order.
      const responses = await Promise.all(
        specificList.map(async (repoName) => {
          try {
            const res = await axios.get(`${specficReposAPI}/${repoName}`);
            return res.data;
          } catch (error) {
            console.error(`Failed to fetch repo "${repoName}":`, error.message);
            return null; // keep slot failure from crashing the whole section
          }
        })
      );

      // Drop failed fetches (nulls). If you prefer showing placeholders for failures,
      // we can keep nulls and render a special "Unavailable" card instead.
      const repoList = responses.filter(Boolean);

      setProjectsArray(repoList);
    } catch (error) {
      console.error(error.message);
      setProjectsArray([]);
    }
  }, [specficReposAPI, specificList]);

  useEffect(() => {
    fetchRepos();
  }, [fetchRepos]);

  return (
    <Jumbotron fluid id="projects" className="bg-light m-0">
      <Container className="">
        <h2 className="display-4 pb-5 text-center">{heading}</h2>
        <Row>
          {projectsArray.length
            ? projectsArray.map((project, index) => (
                <ProjectCard
                  key={`project-card-${index}`}
                  id={`project-card-${index}`}
                  value={project}
                />
              ))
            : dummyProjectsArr.map((project, index) => (
                <ProjectCard
                  key={`dummy-${index}`}
                  id={`dummy-${index}`}
                  value={project}
                />
              ))}
        </Row>
      </Container>
    </Jumbotron>
  );
};

export default Project;
