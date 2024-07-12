import { As, Box, Icon, Tooltip, useColorModeValue } from "@chakra-ui/react";

interface IconButtonProps {
  label: string;
  ttPlacement: string;
  icon: As;
  size: number;
}
function IconButton(props: IconButtonProps) {
  const iconButtonColour = useColorModeValue('gray.200', 'white');
  return (
    <Box
      as='button'
      borderRadius='0px'
      border='0px'
      _hover={{ color: 'blue.200'}}
      >
      <Tooltip bgColor={'black'} color={'gray.200'} label={props.label} placement='right'>
        <span>
        <Icon as={props.icon} boxSize={props.size} color='inherit'/>
        </span>
      </Tooltip>
    </Box>
  )
}

export { IconButton }

// 1B2E31
//
// gradient 1E2022 to 192B2E
