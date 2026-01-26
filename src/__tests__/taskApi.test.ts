import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchTasks, createTask, deleteTask, toggleTask } from '../api/taskApi';

describe('taskApi', () => {
  // Store the original fetch
  const originalFetch = global.fetch;

  beforeEach(() => {
    // Reset fetch mock before each test
    global.fetch = vi.fn();
  });

  afterEach(() => {
    // Restore original fetch after tests
    global.fetch = originalFetch;
  });

  describe('fetchTasks', () => {
    it('returns tasks on successful response', async () => {
      const mockTasks = [
        { id: '1', title: 'Task 1', completed: false },
        { id: '2', title: 'Task 2', completed: true },
      ];

      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockTasks),
      } as Response);

      const result = await fetchTasks();

      expect(result).toEqual(mockTasks);
      expect(global.fetch).toHaveBeenCalledWith('/api/tasks');
    });

    it('throws error on failed response', async () => {
      vi.mocked(global.fetch).mockResolvedValue({
        ok: false,
        status: 500,
      } as Response);

      await expect(fetchTasks()).rejects.toThrow('Failed to fetch tasks');
    });
  });

  // TODO: Add tests for createTask
  // - Test successful creation (mock POST request, verify body and headers)
  // - Test error handling
  describe('createTask', () => {
    it('properly creates a task', async () => {
      //make ourselves a task that we'll test against later
      const mockCreatedTask = { id: '1', title: 'Task 1', complete: false};
      
      //don't let it make an actual api call, but instead 
      //create a return value as though it did make the api call
      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockCreatedTask),
      } as Response);

      //this actually calls our creatTask function,
      //passing in Task 1 as our data
      const result = await createTask('Task 1');

      //verify that our result from calling createTask
      //is equal to our mock task
      expect(result).toEqual(mockCreatedTask);
      //verify that global.fetch was called with
      //the correct information
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/tasks',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify('Task 1'),
        })
      );
    });

    it('properly throws error when failing to create a task', async () => {
      vi.mocked(global.fetch).mockResolvedValue({
        ok: false,
        status: 500,
      } as Response);

      await expect(createTask()).rejects.toThrow('Failed to create task');
    });
  });

  // TODO: Add tests for deleteTask
  // - Test successful deletion (mock DELETE request)
  // - Test error handling
  describe('deleteTask', () => {
    it('properly deletes a task', async () => {
      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
      } as Response);

      await deleteTask(1);

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/tasks/1',
        expect.objectContaining({
          method: 'DELETE',
        })
      );
    });

    it('properly throws an error when it cant delete', async () => {
      vi.mocked(global.fetch).mockResolvedValue({
        ok: false,
      } as Response);

      await expect(deleteTask()).rejects.toThrow('Failed to delete task');
    });
  });

  // TODO: Add tests for toggleTask
  // - Test successful toggle (mock PATCH request, verify body)
  // - Test error handling
  describe('toggleTask', () => {
    it('properly toggles the task', async () => {
      const mockTask = { id: '1', title: 'Task 1', complete: false};

      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockTask),
      } as Response);

      const result = await toggleTask('1', true);

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/tasks/1',
        expect.objectContaining({
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ completed: true }),
        })
      );

    });
    
    it('properly throws errors when it fails to toggle', async () => {
      const mockTask = { id: '1', title: 'Task 1', complete: false};

      vi.mocked(global.fetch).mockResolvedValue({
        ok: false,
        json: () => Promise.resolve(mockTask),
      } as Response);

      await expect(toggleTask()).rejects.toThrow('Failed to update task');

    });
  });
});
