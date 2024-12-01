import React, { useEffect, useRef } from 'react';
import { Mic, MicOff, Video as VideoIcon, VideoOff, PhoneOff } from 'lucide-react';
import { SupportSession } from '../../types/crisis';

interface VideoCallProps {
  session: SupportSession;
  onEndCall: () => void;
}

export function VideoCall({ session, onEndCall }: VideoCallProps) {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = React.useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = React.useState(true);

  useEffect(() => {
    // In a real implementation, this would initialize WebRTC connection
    async function setupMediaStream() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    }

    setupMediaStream();

    return () => {
      // Cleanup media streams
      if (localVideoRef.current?.srcObject) {
        const tracks = (localVideoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const toggleMute = () => {
    if (localVideoRef.current?.srcObject) {
      const audioTracks = (localVideoRef.current.srcObject as MediaStream)
        .getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localVideoRef.current?.srcObject) {
      const videoTracks = (localVideoRef.current.srcObject as MediaStream)
        .getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Main video area */}
      <div className="flex-1 relative">
        <video
          ref={remoteVideoRef}
          className="w-full h-full object-cover"
          autoPlay
          playsInline
        />
        <video
          ref={localVideoRef}
          className="absolute bottom-4 right-4 w-48 h-36 object-cover rounded-lg shadow-lg"
          autoPlay
          playsInline
          muted
        />
      </div>

      {/* Controls */}
      <div className="bg-gray-800 p-4">
        <div className="flex justify-center space-x-4">
          <button
            onClick={toggleMute}
            className={`p-4 rounded-full ${
              isMuted ? 'bg-red-600' : 'bg-gray-600 hover:bg-gray-700'
            }`}
          >
            {isMuted ? (
              <MicOff className="h-6 w-6 text-white" />
            ) : (
              <Mic className="h-6 w-6 text-white" />
            )}
          </button>

          <button
            onClick={onEndCall}
            className="p-4 rounded-full bg-red-600 hover:bg-red-700"
          >
            <PhoneOff className="h-6 w-6 text-white" />
          </button>

          <button
            onClick={toggleVideo}
            className={`p-4 rounded-full ${
              !isVideoEnabled ? 'bg-red-600' : 'bg-gray-600 hover:bg-gray-700'
            }`}
          >
            {isVideoEnabled ? (
              <VideoIcon className="h-6 w-6 text-white" />
            ) : (
              <VideoOff className="h-6 w-6 text-white" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}