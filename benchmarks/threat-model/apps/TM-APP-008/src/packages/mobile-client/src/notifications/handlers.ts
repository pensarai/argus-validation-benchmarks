/**
 * Push notification handlers for foreground, background, and action events.
 */

interface NotificationData {
  type: 'task' | 'project' | 'comment' | 'system';
  resourceId?: string;
  projectId?: string;
  taskId?: string;
}

export function handleNotificationReceived(data: NotificationData): void {
  // Foreground notification -- show in-app notification banner
  console.log('Notification received in foreground:', data);
  // Would trigger the notification store to add a new notification
}

export function handleNotificationOpened(data: NotificationData, navigation: any): void {
  // User tapped notification from background/killed state
  console.log('Notification opened:', data);
  routeToScreen(data, navigation);
}

export function handleNotificationAction(actionId: string, data: NotificationData, navigation: any): void {
  // User tapped a notification action button
  console.log('Notification action:', actionId, data);
  switch (actionId) {
    case 'mark_done':
      // Would call API to mark task as done
      break;
    case 'view':
      routeToScreen(data, navigation);
      break;
    default:
      routeToScreen(data, navigation);
  }
}

function routeToScreen(data: NotificationData, navigation: any): void {
  switch (data.type) {
    case 'task':
      if (data.taskId) navigation.navigate('Tasks', { taskId: data.taskId });
      break;
    case 'project':
      if (data.projectId) navigation.navigate('ProjectDetail', { id: data.projectId });
      break;
    case 'comment':
      if (data.taskId) navigation.navigate('Tasks', { taskId: data.taskId });
      break;
    default:
      navigation.navigate('Dashboard');
  }
}
