import { Pipe, PipeTransform } from '@angular/core';
import Story from '../models/story.model';
import Task from '../models/task.model';

@Pipe({
  name: 'storyStarted'
})
export class StoryStartedPipe implements PipeTransform {
  transform(stories: Story[]) {
    const filteredStories = [];
    for (const story of stories) {
      if (story.tasks) {
        const tasks: Task[] = story.tasks;
        const startedTasks = tasks.filter(t => t.fkTaskStatusId !== 'taskStatus01');
        if (startedTasks.length) {
          filteredStories.push(story);
        }
      }
    }
    return filteredStories;
  }
}
