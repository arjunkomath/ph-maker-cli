export interface User {
  viewer: {
    user: {
      name: string;
    }
  }
}
export interface MakerGoal {
  node: {
    id: string;
    createdAt: string;
    title: string;
    completedAt: string;
    dueAt: string;
    cheerCount: number
    project: {
      id: string;
      name: string;
    };
  }
}

export interface FetchGoalResponse {
  viewer: {
    goals: {
      edges: [MakerGoal]
    }
  }
}

export interface MakerProject {
  node: {
    id: string;
    name: string;
    tagline: string;
    url: string;
  }
}

export interface FetchProjectResponse {
  viewer: {
    makerProjects: {
      edges: [MakerProject]
    }
  }
}
