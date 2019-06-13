export const ValidateUserQuery = `{
  viewer {
    user {
      name
    }
  }
}`

export const ListProjectsQuery = `{
  viewer {
    makerProjects {
      edges {
        node {
          id
          name
          tagline
          url
        }
      }
    }
  }
}`

export const ListGoalsQuery = `{
  viewer {
    goals(first: 15) {
      edges {
        node {
          id
          createdAt
          title
          completedAt
          dueAt
          cheerCount
          project {
            id
            name
          }
        }
      }
    }
  }
}`
