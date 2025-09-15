import { router } from 'expo-router';

export const NavigationHelper = {
  navigateToChat: (groupName: string) => {
    // In a real app, you would pass the group data
    router.push('/chat');
  },
  
  navigateToProfile: () => {
    router.push('/profile');
  },
  
  navigateToGroups: () => {
    router.push('/groups');
  },
  
  navigateToProgress: () => {
    router.push('/explore');
  },
  
  navigateToHome: () => {
    router.push('/');
  }
};
