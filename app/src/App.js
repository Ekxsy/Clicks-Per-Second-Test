import { Box, Heading, Center } from '@chakra-ui/react'
import React, { useState, useEffect, useRef } from 'react';
import Chart from './Chart';
function App() {
  var [testStarted, setTestStarted] = useState(false);
  var [clicks, setClicks] = useState(0);
  var [startTime, setStartTime] = useState(Date.now());
  var [elapsedTime, setElapsedTime] = useState(0);
  var graphData = useRef();
  var seconds = (Date.now() - startTime) / 1000
  useEffect(() => {
    var interval;
    if (testStarted) {
      var currentTime = Date.now();
      setClicks(0);
      setStartTime(currentTime);
      return () => clearInterval(interval);
    }
  }, [testStarted]);
  useEffect(() => {
    if (testStarted) {
      var interval = setInterval(() => {
        setElapsedTime((Date.now() - startTime) / 1000);
      }, 200);
      return () => clearInterval(interval);
    }
  }, [testStarted, clicks])
  const click = () => {
    if (testStarted) {
      setClicks(clicks + 1);
      graphData.current = [clicks, startTime];
    } else {
      setTestStarted(true);
    }
  }
  return (<Box>
    <Center><Heading size='2xl' mt={12}>Clicks per Second Test</Heading></Center>
    <Center><Box userSelect="none" onClick={click} bg='gray.100' h={64} w={800} p={4} mt={16} borderRadius={12} color='gray.500'>
      <Center><Heading size='xl'>{testStarted ? "Keep Clicking Here" : "Click to Start Test"}</Heading></Center>
    </Box></Center>
    <Center><Heading size='xl' pt={12}>Results</Heading></Center>
    <Box key={elapsedTime}>
      <Center><Heading size='lg'>You clicked {clicks} times in {Math.round(seconds)} seconds</Heading></Center>
      <Center><Heading size='lg'>You click at {Math.round(10 * clicks / seconds) / 10} clicks per second</Heading></Center>
    </Box>
    <Center><Chart current={graphData}/></Center>
  </Box>)
}

export default App