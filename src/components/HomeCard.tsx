import { Button, Card, CardBody, CardFooter, CardHeader, Flex, Heading, Icon, Stack, Text } from "@chakra-ui/react";
import { IconType } from "react-icons";
import { HiMiniArrowRight } from "react-icons/hi2";
import { Link } from "react-router-dom";

interface HomeCardProps {
  heading: string;
  body: string;
  icon: IconType;
  navTo: string;
}

function HomeCard(props: HomeCardProps) {

  const { heading, body, icon, navTo } = props;
  return (
  <Card
    borderRadius={'0'}
    borderColor={'#16191F'}
    maxW={'600px'}
    direction={'row'}
    bgColor={'transparent'}
    color={'gray.300'}
    p={1}
    variant={'elevated'}
    boxShadow={'sm'}
    size={'sm'}>
    <Icon as={icon} boxSize={6} color={'#f08080'}/>
    <Stack spacing={'1'}>
    <CardHeader pl={4} p={1}>
      <Heading color={'gray.200'} textAlign={'left'} size='md'>{heading}</Heading>
    </CardHeader>
    <CardBody pl={4} p={1}>
      <Text textAlign={'left'}>{body}</Text>
    </CardBody>
    { navTo !== '' &&
      <CardFooter p={1}>
      <Flex w={'100%'} justify={'flex-end'}>
      <Button
        outline={'0'} border={'0'}
        _hover={{ backgroundColor: 'transparent', color: 'white', outline: '0', border: '0'}}
        _focus={{ color: '#ffda60' , backgroundColor: 'transparent', border: '0', outline: '0'}}
        bgColor={'transparent'} color={'#ffd6a5'} > 
        <Link to={navTo}>
        Try Now <Icon as={HiMiniArrowRight} />
        </Link>
        </Button>
        </Flex>
      </CardFooter>
    }
    </Stack>
    </Card>
  )

}

export { HomeCard }
