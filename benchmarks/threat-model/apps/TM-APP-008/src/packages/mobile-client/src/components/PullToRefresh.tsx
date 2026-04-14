import React from 'react';
import { RefreshControl } from 'react-native';
import { colors } from '../theme/colors';

interface PullToRefreshProps { refreshing: boolean; onRefresh: () => void; }

export default function PullToRefresh({ refreshing, onRefresh }: PullToRefreshProps): React.ReactElement {
  return <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />;
}
