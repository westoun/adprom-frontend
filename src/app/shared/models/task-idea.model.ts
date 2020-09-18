import Project from './project.model';

export default interface TaskIdea {
  taskIdeaId: string;
  fkProjectId?: string;
  project?: Project;
  title?: string;
  description?: string;
}
