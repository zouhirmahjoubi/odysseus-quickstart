
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const getStoredLeads = () => {
  try {
    return JSON.parse(localStorage.getItem('odysseus_mobile_leads') || '[]');
  } catch (e) {
    return [];
  }
};

export const saveLeads = (leads) => {
  localStorage.setItem('odysseus_mobile_leads', JSON.stringify(leads));
};

export const getStoredPosts = () => {
  try {
    return JSON.parse(localStorage.getItem('odysseus_blog_posts') || '[]');
  } catch (e) {
    return [];
  }
};

export const savePosts = (posts) => {
  localStorage.setItem('odysseus_blog_posts', JSON.stringify(posts));
};
