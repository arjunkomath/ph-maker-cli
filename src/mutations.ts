export const CreateGoal = `
  mutation ($input: GoalCreateInput!) {
    goalCreate(input: $input) {
      node {
        title
      }
    }
  }
`

export const UpdateGoal = `
  mutation ($input: GoalUpdateInput!) {
    goalUpdate(input: $input) {
      node {
        id
      }
    }
  }
`

export const GoalMarkAsComplete = `
  mutation ($input: GoalMarkAsCompleteInput!) {
    goalMarkAsComplete(input: $input) {
      node {
        id
      }
    }
  }
`

export const GoalMarkAsIncomplete = `
  mutation ($input: GoalMarkAsIncompleteInput!) {
    goalMarkAsIncomplete(input: $input) {
      node {
        id
      }
    }
  }
`
