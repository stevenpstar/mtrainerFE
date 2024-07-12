import { Box, Center, Grid, GridItem } from "@chakra-ui/react"
import { ProfileCardA } from "./dashboard/ProfileCardA"

function Dashboard() {
  return (
  <Center h='100%' w='100%' p={12}>
    <Box h='100%' w='100%' minH={'400px'}>
    <Center h='100%' w='100%'>
    <Grid
      templateAreas={`
      "profileA profileB profileB"
      "options options options"`
      }
      gridTemplateRows={'220px 1fr'}
      gridTemplateColumns={'1fr 1fr 1fr'}
      h='100%'
      w='80%'
      color={'gray.900'}
      gap={1}
      >
      <GridItem borderRadius={'5px'} area={'profileA'} boxShadow={"md"}>
        <ProfileCardA />
      </GridItem>
      <GridItem area={'profileB'} boxShadow="md">
      ho
      </GridItem>
      <GridItem area={'options'} boxShadow="md"></GridItem>
    </Grid>
    </Center>
    </Box>
  </Center>
)
}

export { Dashboard }
