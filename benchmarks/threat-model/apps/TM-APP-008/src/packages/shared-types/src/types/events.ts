/**
 * WebSocket event type definitions.
 * Events are published by the API server and consumed by web and mobile clients.
 */

export interface BaseEvent {
  type: string;
  timestamp: string;
  userId?: string;
}

export interface TaskAssignedEvent extends BaseEvent {
  type: 'task.assigned';
  payload: {
    taskId: string;
    taskTitle: string;
    projectId: string;
    projectName: string;
    assigneeId: string;
    assignedBy: string;
  };
}

export interface CommentAddedEvent extends BaseEvent {
  type: 'comment.added';
  payload: {
    commentId: string;
    taskId: string;
    taskTitle: string;
    authorId: string;
    authorName: string;
    contentPreview: string;
  };
}

export interface ProjectUpdatedEvent extends BaseEvent {
  type: 'project.updated';
  payload: {
    projectId: string;
    projectName: string;
    changes: string[];
    updatedBy: string;
  };
}

export interface NotificationEvent extends BaseEvent {
  type: 'notification';
  payload: {
    id: string;
    title: string;
    message: string;
    category: 'task' | 'project' | 'comment' | 'system';
    actionUrl?: string;
  };
}

export interface TaskStatusChangedEvent extends BaseEvent {
  type: 'task.status_changed';
  payload: {
    taskId: string;
    taskTitle: string;
    fromStatus: string;
    toStatus: string;
    changedBy: string;
  };
}

export interface MemberJoinedEvent extends BaseEvent {
  type: 'member.joined';
  payload: {
    organizationId: string;
    organizationName: string;
    memberId: string;
    memberName: string;
    role: string;
  };
}

export type AppEvent =
  | TaskAssignedEvent
  | CommentAddedEvent
  | ProjectUpdatedEvent
  | NotificationEvent
  | TaskStatusChangedEvent
  | MemberJoinedEvent;

export type EventType = AppEvent['type'];
