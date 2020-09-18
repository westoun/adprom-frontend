import { Pipe, PipeTransform } from '@angular/core';
import Story from '../models/story.model';
import Task from '../models/task.model';

@Pipe({
  name: 'storyNotStarted'
})
export class StoryNotStartedPipe implements PipeTransform {
  transform(stories: Story[]) {
    const filteredStories: Story[] = [];
    for (const story of stories) {
      if (story.tasks && story.tasks.length) {
        const tasks: Task[] = story.tasks;
        const startedTasks = tasks.filter(t => t.fkTaskStatusId !== 'taskStatus01');
        if (startedTasks.length === 0) {
          filteredStories.push(story);
        }
      }
    }
    return filteredStories;
  }
}
