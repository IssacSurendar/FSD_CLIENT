export const TaskStatus = ['Pending', 'InProgress', 'Hold', 'Completed']
export const ProjectStatus = ['Open', 'In Progress', 'Hold', 'Completed', 'Closed']
export const UserRole = ['Admin', 'TaskCreator', 'User']

export const formatDate = (isoString) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
};