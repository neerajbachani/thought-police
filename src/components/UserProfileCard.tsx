import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Shield, 
  Star, 
  Trophy, 
  Target, 
  Calendar, 
  TrendingUp, 
  Award,
  MessageSquare,
  Eye,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Users,
  Activity,
  Zap,
  Crown,
  Medal,
  Download,
  Share2,
  Camera,
  Twitter,
  Facebook,
  Instagram,
  Copy,
  Check
} from 'lucide-react';
import html2canvas from 'html2canvas';

interface UserData {
  rank: number;
  username: string;
  points: number;
  cases: number;
  karma: number;
  joinDate?: string;
  accuracyRate?: number;
  badgeCount?: number;
  specializations?: string[];
  recentActivity?: Array<{
    type: 'case' | 'comment' | 'achievement';
    description: string;
    time: string;
    points?: number;
  }>;
  achievements?: Array<{
    name: string;
    icon: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    date: string;
  }>;
}

interface UserProfileCardProps {
  user: UserData | null;
  isOpen: boolean;
  onClose: () => void;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({ user, isOpen, onClose }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);
  const [isCapturing, setIsCapturing] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setScreenHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!user) return null;

  // Determine if we need compact mode based on screen height
  const isCompactMode = screenHeight < 700;
  const cardHeight = isCompactMode ? Math.min(screenHeight - 80, 550) : 600;

  const captureCard = async () => {
    if (!cardRef.current) return null;

    setIsCapturing(true);
    try {
      // Find the actual card content div
      const cardContent = cardRef.current.querySelector('[data-card-content]') as HTMLElement;
      if (!cardContent) {
        console.error('Card content not found');
        return null;
      }

      // Hide UI elements during capture
      const elementsToHide = [
        ...document.querySelectorAll('.share-controls'),
        ...document.querySelectorAll('.close-button'),
        ...document.querySelectorAll('[data-hide-on-capture]')
      ];
      
      elementsToHide.forEach(el => {
        (el as HTMLElement).style.visibility = 'hidden';
      });

      // Wait for elements to hide
      await new Promise(resolve => setTimeout(resolve, 100));

      // Create a static version of the card for capture
      const captureContainer = document.createElement('div');
      captureContainer.style.position = 'fixed';
      captureContainer.style.top = '-9999px';
      captureContainer.style.left = '-9999px';
      captureContainer.style.width = '800px';
      captureContainer.style.height = '600px';
      captureContainer.style.zIndex = '-1';

      // Create the card HTML structure manually to ensure all content is captured
      const cardHTML = createCardHTML(user, isFlipped);
      captureContainer.innerHTML = cardHTML;

      document.body.appendChild(captureContainer);

      // Wait for fonts and styles to load
      await new Promise(resolve => setTimeout(resolve, 500));

      // Capture with high quality settings
      const canvas = await html2canvas(captureContainer, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        imageTimeout: 15000,
        width: 800,
        height: 600,
        foreignObjectRendering: false,
        removeContainer: false
      });

      // Clean up
      document.body.removeChild(captureContainer);
      
      // Restore hidden elements
      elementsToHide.forEach(el => {
        (el as HTMLElement).style.visibility = 'visible';
      });

      const imageDataUrl = canvas.toDataURL('image/png', 1.0);
      setCapturedImage(imageDataUrl);
      setShowImagePreview(true);
      
      return canvas;
    } catch (error) {
      console.error('Failed to capture card:', error);
      
      // Restore hidden elements on error
      const elementsToHide = [
        ...document.querySelectorAll('.share-controls'),
        ...document.querySelectorAll('.close-button'),
        ...document.querySelectorAll('[data-hide-on-capture]')
      ];
      elementsToHide.forEach(el => {
        (el as HTMLElement).style.visibility = 'visible';
      });
      
      return null;
    } finally {
      setIsCapturing(false);
    }
  };

  const createCardHTML = (userData: UserData, flipped: boolean) => {
    const getRankGradient = (rank: number) => {
      switch (rank) {
        case 1:
          return 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)';
        case 2:
          return 'linear-gradient(135deg, #d1d5db 0%, #9ca3af 50%, #6b7280 100%)';
        case 3:
          return 'linear-gradient(135deg, #fbbf24 0%, #f97316 50%, #ea580c 100%)';
        default:
          return 'linear-gradient(135deg, #FF4500 0%, #dc2626 50%, #CC3700 100%)';
      }
    };

    const getRankIcon = (rank: number) => {
      switch (rank) {
        case 1:
          return '👑';
        case 2:
          return '🏆';
        case 3:
          return '🥉';
        default:
          return '🛡️';
      }
    };

    const getRedditAvatar = (username: string) => {
      const avatarIndex = username.charCodeAt(0) % 10;
      return `https://www.redditstatic.com/avatars/defaults/v2/avatar_default_${avatarIndex}.png`;
    };

    const mockRecentActivity = [
      { type: 'case', description: 'Solved contradiction case #1247', time: '2h ago', points: 150 },
      { type: 'achievement', description: 'Earned "Eagle Eye" badge', time: '1d ago' },
      { type: 'comment', description: 'Top comment in r/ThoughtPolice', time: '2d ago', points: 45 },
      { type: 'case', description: 'Found political contradiction', time: '3d ago', points: 200 },
    ];

    if (flipped) {
      // Back side content
      return `
        <div style="
          width: 800px;
          height: 600px;
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #000000 100%);
          border-radius: 24px;
          position: relative;
          overflow: hidden;
          color: white;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        ">
          <!-- Background Effects -->
          <div style="
            position: absolute;
            inset: 0;
            background: radial-gradient(circle at 70% 30%, rgba(255,69,0,0.1), transparent 50%);
          "></div>
          
          <!-- Content -->
          <div style="padding: 48px; position: relative; z-index: 10;">
            <div style="text-align: center; margin-bottom: 32px;">
              <h2 style="font-size: 32px; font-weight: bold; margin: 0 0 8px 0;">Officer Profile</h2>
              <p style="color: rgba(255,255,255,0.7); margin: 0;">Detailed Statistics & Achievements</p>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px;">
              <!-- Performance Stats -->
              <div style="
                background: rgba(0,0,0,0.2);
                border-radius: 16px;
                padding: 24px;
                backdrop-filter: blur(10px);
              ">
                <h3 style="font-size: 18px; font-weight: bold; margin: 0 0 16px 0; display: flex; align-items: center;">
                  🎯 Performance
                </h3>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                  <div style="display: flex; justify-between;">
                    <span style="color: rgba(255,255,255,0.7);">Total Karma</span>
                    <span style="font-weight: bold;">${userData.karma.toLocaleString()}</span>
                  </div>
                  <div style="display: flex; justify-between;">
                    <span style="color: rgba(255,255,255,0.7);">Badge Count</span>
                    <span style="font-weight: bold;">${userData.badgeCount || 12}</span>
                  </div>
                  <div style="display: flex; justify-between;">
                    <span style="color: rgba(255,255,255,0.7);">Join Date</span>
                    <span style="font-weight: bold;">${userData.joinDate || 'Jan 2024'}</span>
                  </div>
                  <div style="display: flex; justify-between;">
                    <span style="color: rgba(255,255,255,0.7);">Rank Progress</span>
                    <span style="font-weight: bold; color: #10b981;">Elite</span>
                  </div>
                </div>
              </div>

              <!-- Achievements -->
              <div style="
                background: rgba(0,0,0,0.2);
                border-radius: 16px;
                padding: 24px;
                backdrop-filter: blur(10px);
              ">
                <h3 style="font-size: 18px; font-weight: bold; margin: 0 0 16px 0; display: flex; align-items: center;">
                  🏆 Achievements
                </h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                  <div style="text-align: center; padding: 12px; border-radius: 8px; background: linear-gradient(45deg, #fbbf24, #f97316);">
                    <div style="font-size: 20px; margin-bottom: 4px;">🏆</div>
                    <div style="font-size: 12px; font-weight: 500;">Truth Seeker</div>
                  </div>
                  <div style="text-align: center; padding: 12px; border-radius: 8px; background: linear-gradient(45deg, #8b5cf6, #ec4899);">
                    <div style="font-size: 20px; margin-bottom: 4px;">🏆</div>
                    <div style="font-size: 12px; font-weight: 500;">Eagle Eye</div>
                  </div>
                  <div style="text-align: center; padding: 12px; border-radius: 8px; background: linear-gradient(45deg, #3b82f6, #6366f1);">
                    <div style="font-size: 20px; margin-bottom: 4px;">🏆</div>
                    <div style="font-size: 12px; font-weight: 500;">First Case</div>
                  </div>
                  <div style="text-align: center; padding: 12px; border-radius: 8px; background: linear-gradient(45deg, #10b981, #059669);">
                    <div style="font-size: 20px; margin-bottom: 4px;">🏆</div>
                    <div style="font-size: 12px; font-weight: 500;">Pattern Master</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Specializations -->
            <div style="
              background: rgba(0,0,0,0.2);
              border-radius: 16px;
              padding: 24px;
              backdrop-filter: blur(10px);
            ">
              <h3 style="font-size: 18px; font-weight: bold; margin: 0 0 16px 0; display: flex; align-items: center;">
                🛡️ Specializations
              </h3>
              <div style="display: flex; flex-wrap: gap: 8px;">
                <span style="padding: 4px 12px; background: rgba(255,69,0,0.2); border: 1px solid rgba(255,69,0,0.3); border-radius: 20px; font-size: 12px; color: #ff6314;">Political Analysis</span>
                <span style="padding: 4px 12px; background: rgba(255,69,0,0.2); border: 1px solid rgba(255,69,0,0.3); border-radius: 20px; font-size: 12px; color: #ff6314;">Sentiment Detection</span>
                <span style="padding: 4px 12px; background: rgba(255,69,0,0.2); border: 1px solid rgba(255,69,0,0.3); border-radius: 20px; font-size: 12px; color: #ff6314;">Pattern Recognition</span>
                <span style="padding: 4px 12px; background: rgba(255,69,0,0.2); border: 1px solid rgba(255,69,0,0.3); border-radius: 20px; font-size: 12px; color: #ff6314;">Fact Checking</span>
                <span style="padding: 4px 12px; background: rgba(255,69,0,0.2); border: 1px solid rgba(255,69,0,0.3); border-radius: 20px; font-size: 12px; color: #ff6314;">Behavioral Analysis</span>
              </div>
            </div>
          </div>
        </div>
      `;
    } else {
      // Front side content
      return `
        <div style="
          width: 800px;
          height: 600px;
          background: ${getRankGradient(userData.rank)};
          border-radius: 24px;
          position: relative;
          overflow: hidden;
          color: white;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        ">
          <!-- Background Effects -->
          <div style="
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, rgba(0,0,0,0.2) 0%, transparent 50%, rgba(0,0,0,0.3) 100%);
          "></div>
          <div style="
            position: absolute;
            inset: 0;
            background: radial-gradient(circle at 30% 20%, rgba(255,255,255,0.1), transparent 50%);
          "></div>
          <div style="
            position: absolute;
            inset: 0;
            background: radial-gradient(circle at 70% 80%, rgba(255,255,255,0.05), transparent 50%);
          "></div>
          
          <!-- Floating particles -->
          <div style="position: absolute; top: 40px; left: 40px; width: 8px; height: 8px; background: rgba(255,255,255,0.2); border-radius: 50%;"></div>
          <div style="position: absolute; top: 80px; right: 80px; width: 12px; height: 12px; background: rgba(255,255,255,0.15); border-radius: 50%;"></div>
          <div style="position: absolute; bottom: 80px; left: 80px; width: 4px; height: 4px; background: rgba(255,255,255,0.25); border-radius: 50%;"></div>
          <div style="position: absolute; bottom: 40px; right: 40px; width: 8px; height: 8px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>

          <!-- Content -->
          <div style="position: relative; z-index: 10; padding: 48px; height: 100%; display: flex; flex-direction: column;">
            <!-- Header -->
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 32px;">
              <div style="display: flex; align-items: center; gap: 16px;">
                <div style="position: relative;">
                  <div style="font-size: 48px;">${getRankIcon(userData.rank)}</div>
                  <div style="position: absolute; inset: 0; background: rgba(255,255,255,0.2); border-radius: 50%; filter: blur(8px);"></div>
                </div>
                <div>
                  <h1 style="font-size: 36px; font-weight: bold; margin: 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
                    u/${userData.username}
                  </h1>
                  <p style="color: rgba(255,255,255,0.8); font-size: 18px; margin: 0;">
                    Rank #${userData.rank} • Elite Detective
                  </p>
                </div>
              </div>
              
              <div style="text-align: right;">
                <div style="font-size: 12px; color: rgba(255,255,255,0.6);">Badge #</div>
                <div style="font-size: 20px; font-weight: bold;">TP${userData.rank.toString().padStart(6, '0')}</div>
              </div>
            </div>

            <!-- Avatar and Stats -->
            <div style="display: flex; align-items: center; gap: 32px; margin-bottom: 32px;">
              <div style="position: relative; flex-shrink: 0;">
                <img
                  src="${getRedditAvatar(userData.username)}"
                  alt="${userData.username}"
                  style="
                    width: 120px;
                    height: 120px;
                    border-radius: 50%;
                    border: 4px solid rgba(255,255,255,0.3);
                    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
                  "
                />
                <div style="
                  position: absolute;
                  top: -4px;
                  right: -4px;
                  width: 32px;
                  height: 32px;
                  background: #FF4500;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  box-shadow: 0 4px 16px rgba(0,0,0,0.3);
                  border: 2px solid white;
                ">
                  <span style="font-size: 16px;">⭐</span>
                </div>
              </div>

              <div style="flex: 1; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px;">
                <div style="
                  text-align: center;
                  background: rgba(0,0,0,0.2);
                  border-radius: 16px;
                  padding: 20px;
                  backdrop-filter: blur(10px);
                ">
                  <div style="font-size: 32px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
                    ${userData.points.toLocaleString()}
                  </div>
                  <div style="color: rgba(255,255,255,0.7); font-size: 12px;">Points</div>
                </div>
                
                <div style="
                  text-align: center;
                  background: rgba(0,0,0,0.2);
                  border-radius: 16px;
                  padding: 20px;
                  backdrop-filter: blur(10px);
                ">
                  <div style="font-size: 32px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
                    ${userData.cases}
                  </div>
                  <div style="color: rgba(255,255,255,0.7); font-size: 12px;">Cases</div>
                </div>
                
                <div style="
                  text-align: center;
                  background: rgba(0,0,0,0.2);
                  border-radius: 16px;
                  padding: 20px;
                  backdrop-filter: blur(10px);
                ">
                  <div style="font-size: 32px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
                    ${(userData.accuracyRate || 89.2).toFixed(1)}%
                  </div>
                  <div style="color: rgba(255,255,255,0.7); font-size: 12px;">Accuracy</div>
                </div>
              </div>
            </div>

            <!-- Recent Activity -->
            <div style="
              background: rgba(0,0,0,0.2);
              border-radius: 16px;
              padding: 24px;
              backdrop-filter: blur(10px);
              flex: 1;
            ">
              <h3 style="font-size: 20px; font-weight: bold; margin: 0 0 16px 0; display: flex; align-items: center;">
                📊 Recent Activity
              </h3>
              <div style="display: flex; flex-direction: column; gap: 12px;">
                ${mockRecentActivity.slice(0, 4).map((activity, index) => `
                  <div style="
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    background: rgba(255,255,255,0.1);
                    border-radius: 8px;
                    padding: 12px;
                  ">
                    <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
                      <div style="
                        width: 8px;
                        height: 8px;
                        border-radius: 50%;
                        background: ${
                          activity.type === 'case' ? '#10b981' :
                          activity.type === 'achievement' ? '#fbbf24' :
                          '#3b82f6'
                        };
                        flex-shrink: 0;
                      "></div>
                      <div style="flex: 1;">
                        <div style="font-size: 14px; font-weight: 500;">${activity.description}</div>
                        <div style="font-size: 12px; color: rgba(255,255,255,0.6);">${activity.time}</div>
                      </div>
                    </div>
                    ${activity.points ? `
                      <div style="color: #10b981; font-weight: bold; font-size: 14px; flex-shrink: 0;">
                        +${activity.points}
                      </div>
                    ` : ''}
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      `;
    }
  };

  const downloadImage = async (imageUrl?: string) => {
    let canvas;
    if (imageUrl) {
      // Use existing captured image
      const link = document.createElement('a');
      link.download = `thought-police-${user.username}-card.png`;
      link.href = imageUrl;
      link.click();
    } else {
      // Capture new image
      canvas = await captureCard();
      if (!canvas) return;

      const link = document.createElement('a');
      link.download = `thought-police-${user.username}-card.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    }
  };

  const shareToSocial = async (platform: string, imageUrl?: string) => {
    let canvas;
    if (imageUrl) {
      // Convert data URL to blob
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      handleSocialShare(platform, blob);
    } else {
      canvas = await captureCard();
      if (!canvas) return;

      canvas.toBlob(async (blob) => {
        if (!blob) return;
        handleSocialShare(platform, blob);
      }, 'image/png', 1.0);
    }
  };

  const handleSocialShare = async (platform: string, blob: Blob) => {
    const text = `Check out my Thought Police officer card! 🚔 Rank #${user.rank} with ${user.points} points! #ThoughtPolice #RedditAnalysis`;
    
    if (navigator.share && platform === 'native') {
      try {
        const file = new File([blob], `thought-police-${user.username}.png`, { type: 'image/png' });
        await navigator.share({
          title: 'My Thought Police Card',
          text,
          files: [file]
        });
      } catch (error) {
        console.log('Native sharing failed, falling back to download');
        downloadImage();
      }
    } else {
      // Fallback to platform-specific URLs
      const urls = {
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
        instagram: '', // Instagram doesn't support direct URL sharing
      };

      if (urls[platform as keyof typeof urls]) {
        window.open(urls[platform as keyof typeof urls], '_blank');
      }
      
      // Also download the image for manual sharing
      const link = document.createElement('a');
      link.download = `thought-police-${user.username}.png`;
      link.href = URL.createObjectURL(blob);
      link.click();
    }
  };

  const copyToClipboard = async (imageUrl?: string) => {
    let canvas;
    if (imageUrl) {
      // Convert data URL to blob
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      await handleClipboardCopy(blob);
    } else {
      canvas = await captureCard();
      if (!canvas) return;

      canvas.toBlob(async (blob) => {
        if (!blob) return;
        await handleClipboardCopy(blob);
      }, 'image/png', 1.0);
    }
  };

  const handleClipboardCopy = async (blob: Blob) => {
    try {
      const item = new ClipboardItem({ 'image/png': blob });
      await navigator.clipboard.write([item]);
      
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.log('Clipboard API failed, downloading instead');
      const link = document.createElement('a');
      link.download = `thought-police-${user.username}.png`;
      link.href = URL.createObjectURL(blob);
      link.click();
    }
  };

  const getRankIcon = (rank: number) => {
    const iconSize = isCompactMode ? 'h-6 w-6' : 'h-8 w-8';
    switch (rank) {
      case 1:
        return <Crown className={`${iconSize} text-yellow-500 drop-shadow-lg`} />;
      case 2:
        return <Trophy className={`${iconSize} text-gray-400 drop-shadow-lg`} />;
      case 3:
        return <Medal className={`${iconSize} text-amber-600 drop-shadow-lg`} />;
      default:
        return <Shield className={`${iconSize} text-reddit-orange`} />;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-yellow-400 via-amber-500 to-yellow-600';
      case 2:
        return 'from-gray-300 via-gray-400 to-gray-500';
      case 3:
        return 'from-amber-400 via-orange-500 to-amber-600';
      default:
        return 'from-reddit-orange via-red-500 to-reddit-orange-dark';
    }
  };

  const getRedditAvatar = (username: string) => {
    const avatarIndex = username.charCodeAt(0) % 10;
    return `https://www.redditstatic.com/avatars/defaults/v2/avatar_default_${avatarIndex}.png`;
  };

  const mockRecentActivity = [
    { type: 'case' as const, description: 'Solved contradiction case #1247', time: '2h ago', points: 150 },
    { type: 'achievement' as const, description: 'Earned "Eagle Eye" badge', time: '1d ago' },
    { type: 'comment' as const, description: 'Top comment in r/ThoughtPolice', time: '2d ago', points: 45 },
    { type: 'case' as const, description: 'Found political contradiction', time: '3d ago', points: 200 },
  ];

  const mockAchievements = [
    { name: 'Truth Seeker', icon: 'target', rarity: 'epic' as const, date: '2024-01-15' },
    { name: 'Eagle Eye', icon: 'eye', rarity: 'rare' as const, date: '2024-02-20' },
    { name: 'First Case', icon: 'award', rarity: 'common' as const, date: '2024-01-10' },
    { name: 'Pattern Master', icon: 'activity', rarity: 'legendary' as const, date: '2024-03-01' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 overflow-y-auto"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
          onClick={onClose}
        >
          {/* 3D Card Container */}
          <motion.div
            ref={cardRef}
            data-card-ref="true"
            initial={{ scale: 0.5, rotateY: -180, opacity: 0 }}
            animate={{ scale: 1, rotateY: 0, opacity: 1 }}
            exit={{ scale: 0.5, rotateY: 180, opacity: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 20,
              duration: 0.8 
            }}
            className="relative w-full max-w-4xl perspective-1000 my-auto"
            style={{ 
              perspective: '1000px',
              height: `${cardHeight}px`,
              minHeight: '500px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              data-card-content="true"
              className="relative w-full h-full preserve-3d cursor-pointer"
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              onClick={() => setIsFlipped(!isFlipped)}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Front Side */}
              <div 
                className="absolute inset-0 w-full h-full backface-hidden"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <div className={`relative w-full h-full bg-gradient-to-br ${getRankColor(user.rank)} rounded-3xl shadow-2xl overflow-hidden`}>
                  {/* Animated Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/30"></div>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]"></div>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.05),transparent_50%)]"></div>
                  
                  {/* Floating particles */}
                  <div className="absolute top-10 left-10 w-2 h-2 bg-white/20 rounded-full animate-pulse"></div>
                  <div className="absolute top-20 right-20 w-3 h-3 bg-white/15 rounded-full animate-ping"></div>
                  <div className="absolute bottom-20 left-20 w-1 h-1 bg-white/25 rounded-full animate-pulse"></div>
                  <div className="absolute bottom-10 right-10 w-2 h-2 bg-white/10 rounded-full animate-ping"></div>

                  {/* Close Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onClose();
                    }}
                    className="close-button absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 rounded-full transition-colors backdrop-blur-sm"
                    data-hide-on-capture="true"
                  >
                    <X className="h-5 w-5 text-white" />
                  </button>

                  {/* Card Content - Scrollable */}
                  <div className="relative z-10 h-full flex flex-col text-white overflow-y-auto">
                    <div className={`p-${isCompactMode ? '6' : '8'} flex-1`}>
                      {/* Header */}
                      <div className={`flex items-center justify-between ${isCompactMode ? 'mb-4' : 'mb-6'}`}>
                        <div className="flex items-center space-x-3">
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.3, type: "spring" }}
                            className="relative"
                          >
                            {getRankIcon(user.rank)}
                            <div className="absolute inset-0 bg-white/20 rounded-full blur-lg animate-pulse"></div>
                          </motion.div>
                          <div>
                            <motion.h1 
                              initial={{ x: -50, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.4 }}
                              className={`${isCompactMode ? 'text-2xl' : 'text-3xl'} font-bold drop-shadow-lg`}
                            >
                              u/{user.username}
                            </motion.h1>
                            <motion.p 
                              initial={{ x: -50, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.5 }}
                              className={`text-white/80 ${isCompactMode ? 'text-base' : 'text-lg'}`}
                            >
                              Rank #{user.rank} • Elite Detective
                            </motion.p>
                          </div>
                        </div>
                        
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.6, type: "spring" }}
                          className="text-right"
                        >
                          <div className="text-xs text-white/60">Badge #</div>
                          <div className={`${isCompactMode ? 'text-lg' : 'text-xl'} font-bold`}>TP{user.rank.toString().padStart(6, '0')}</div>
                        </motion.div>
                      </div>

                      {/* Avatar and Stats */}
                      <div className={`flex items-center ${isCompactMode ? 'space-x-4 mb-4' : 'space-x-8 mb-8'}`}>
                        <motion.div
                          initial={{ scale: 0, rotate: 180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: 0.7, type: "spring" }}
                          className="relative flex-shrink-0"
                        >
                          <img
                            src={getRedditAvatar(user.username)}
                            alt={user.username}
                            className={`${isCompactMode ? 'w-16 h-16' : 'w-24 h-24'} rounded-full border-4 border-white/30 shadow-xl ring-4 ring-white/10`}
                          />
                          <div className={`absolute -top-1 -right-1 ${isCompactMode ? 'w-6 h-6' : 'w-8 h-8'} bg-reddit-orange rounded-full flex items-center justify-center shadow-lg border-2 border-white`}>
                            <Star className={`${isCompactMode ? 'h-3 w-3' : 'h-4 w-4'} text-white`} />
                          </div>
                        </motion.div>

                        <div className="flex-1 grid grid-cols-3 gap-3">
                          <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className={`text-center bg-black/20 rounded-xl ${isCompactMode ? 'p-3' : 'p-4'} backdrop-blur-sm`}
                          >
                            <div className={`${isCompactMode ? 'text-xl' : 'text-3xl'} font-bold text-white drop-shadow-lg`}>{user.points.toLocaleString()}</div>
                            <div className="text-white/70 text-xs">Points</div>
                          </motion.div>
                          
                          <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.9 }}
                            className={`text-center bg-black/20 rounded-xl ${isCompactMode ? 'p-3' : 'p-4'} backdrop-blur-sm`}
                          >
                            <div className={`${isCompactMode ? 'text-xl' : 'text-3xl'} font-bold text-white drop-shadow-lg`}>{user.cases}</div>
                            <div className="text-white/70 text-xs">Cases</div>
                          </motion.div>
                          
                          <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 1.0 }}
                            className={`text-center bg-black/20 rounded-xl ${isCompactMode ? 'p-3' : 'p-4'} backdrop-blur-sm`}
                          >
                            <div className={`${isCompactMode ? 'text-xl' : 'text-3xl'} font-bold text-white drop-shadow-lg`}>{(user.accuracyRate || 89.2).toFixed(1)}%</div>
                            <div className="text-white/70 text-xs">Accuracy</div>
                          </motion.div>
                        </div>
                      </div>

                      {/* Recent Activity */}
                      <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 1.1 }}
                        className={`bg-black/20 rounded-xl ${isCompactMode ? 'p-4' : 'p-6'} backdrop-blur-sm flex-1`}
                      >
                        <h3 className={`${isCompactMode ? 'text-lg' : 'text-xl'} font-bold mb-3 flex items-center`}>
                          <Activity className="h-4 w-4 mr-2" />
                          Recent Activity
                        </h3>
                        <div className={`space-y-2 ${isCompactMode ? 'max-h-32' : 'max-h-40'} overflow-y-auto`}>
                          {mockRecentActivity.slice(0, isCompactMode ? 3 : 4).map((activity, index) => (
                            <motion.div
                              key={index}
                              initial={{ x: -30, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 1.2 + index * 0.1 }}
                              className={`flex items-center justify-between bg-white/10 rounded-lg ${isCompactMode ? 'p-2' : 'p-3'}`}
                            >
                              <div className="flex items-center space-x-2 flex-1 min-w-0">
                                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                  activity.type === 'case' ? 'bg-green-400' :
                                  activity.type === 'achievement' ? 'bg-yellow-400' :
                                  'bg-blue-400'
                                }`}></div>
                                <div className="min-w-0 flex-1">
                                  <div className={`${isCompactMode ? 'text-xs' : 'text-sm'} font-medium truncate`}>{activity.description}</div>
                                  <div className="text-xs text-white/60">{activity.time}</div>
                                </div>
                              </div>
                              {activity.points && (
                                <div className={`text-green-400 font-bold flex-shrink-0 ${isCompactMode ? 'text-xs' : 'text-sm'}`}>+{activity.points}</div>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    </div>

                    {/* Flip Indicator */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.5 }}
                      className={`text-center ${isCompactMode ? 'py-2' : 'py-4'}`}
                      data-hide-on-capture="true"
                    >
                      <div className="text-white/60 text-xs flex items-center justify-center space-x-2">
                        <Zap className="h-3 w-3" />
                        <span>Click to flip card</span>
                        <Zap className="h-3 w-3" />
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Back Side */}
              <div 
                className="absolute inset-0 w-full h-full backface-hidden"
                style={{ 
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)'
                }}
              >
                <div className="relative w-full h-full bg-gradient-to-br from-slate-800 via-slate-900 to-black rounded-3xl shadow-2xl overflow-hidden">
                  {/* Animated Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-reddit-blue/20 via-reddit-orange/20 to-purple-600/20"></div>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,69,0,0.1),transparent_50%)]"></div>
                  
                  {/* Close Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onClose();
                    }}
                    className="close-button absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 rounded-full transition-colors backdrop-blur-sm"
                    data-hide-on-capture="true"
                  >
                    <X className="h-5 w-5 text-white" />
                  </button>

                  {/* Back Content - Scrollable */}
                  <div className="relative z-10 h-full flex flex-col text-white overflow-y-auto">
                    <div className={`p-${isCompactMode ? '6' : '8'} flex-1`}>
                      <div className="text-center mb-4">
                        <h2 className={`${isCompactMode ? 'text-xl' : 'text-2xl'} font-bold mb-2`}>Officer Profile</h2>
                        <p className="text-white/70 text-sm">Detailed Statistics & Achievements</p>
                      </div>

                      <div className={`grid grid-cols-1 ${isCompactMode ? 'gap-4 mb-4' : 'md:grid-cols-2 gap-6 mb-6'}`}>
                        {/* Detailed Stats */}
                        <div className={`bg-black/20 rounded-xl ${isCompactMode ? 'p-4' : 'p-6'} backdrop-blur-sm`}>
                          <h3 className={`${isCompactMode ? 'text-base' : 'text-lg'} font-bold mb-3 flex items-center`}>
                            <Target className="h-4 w-4 mr-2" />
                            Performance
                          </h3>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-white/70 text-sm">Total Karma</span>
                              <span className="font-bold text-sm">{user.karma.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-white/70 text-sm">Badge Count</span>
                              <span className="font-bold text-sm">{user.badgeCount || 12}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-white/70 text-sm">Join Date</span>
                              <span className="font-bold text-sm">{user.joinDate || 'Jan 2024'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-white/70 text-sm">Rank Progress</span>
                              <span className="font-bold text-green-400 text-sm">Elite</span>
                            </div>
                          </div>
                        </div>

                        {/* Achievements */}
                        <div className={`bg-black/20 rounded-xl ${isCompactMode ? 'p-4' : 'p-6'} backdrop-blur-sm`}>
                          <h3 className={`${isCompactMode ? 'text-base' : 'text-lg'} font-bold mb-3 flex items-center`}>
                            <Trophy className="h-4 w-4 mr-2" />
                            Achievements
                          </h3>
                          <div className="grid grid-cols-2 gap-2">
                            {mockAchievements.map((achievement, index) => (
                              <motion.div
                                key={index}
                                initial={{ scale: 0, rotate: 180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ delay: 0.5 + index * 0.1 }}
                                className={`text-center ${isCompactMode ? 'p-2' : 'p-3'} rounded-lg ${
                                  achievement.rarity === 'legendary' ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                                  achievement.rarity === 'epic' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                                  achievement.rarity === 'rare' ? 'bg-gradient-to-r from-blue-500 to-indigo-500' :
                                  'bg-gradient-to-r from-green-500 to-emerald-500'
                                }`}
                              >
                                <Trophy className={`${isCompactMode ? 'h-4 w-4' : 'h-6 w-6'} text-white mx-auto mb-1`} />
                                <div className="text-xs font-medium text-white">{achievement.name}</div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Specializations */}
                      <div className={`bg-black/20 rounded-xl ${isCompactMode ? 'p-4' : 'p-6'} backdrop-blur-sm`}>
                        <h3 className={`${isCompactMode ? 'text-base' : 'text-lg'} font-bold mb-3 flex items-center`}>
                          <Shield className="h-4 w-4 mr-2" />
                          Specializations
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {['Political Analysis', 'Sentiment Detection', 'Pattern Recognition', 'Fact Checking', 'Behavioral Analysis'].slice(0, isCompactMode ? 4 : 5).map((spec, index) => (
                            <motion.span
                              key={index}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.8 + index * 0.1 }}
                              className="px-2 py-1 bg-reddit-orange/20 border border-reddit-orange/30 rounded-full text-xs text-reddit-orange-light"
                            >
                              {spec}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Flip Indicator */}
                    <div className={`text-center ${isCompactMode ? 'py-2' : 'py-4'}`} data-hide-on-capture="true">
                      <div className="text-white/60 text-xs flex items-center justify-center space-x-2">
                        <Zap className="h-3 w-3" />
                        <span>Click to flip back</span>
                        <Zap className="h-3 w-3" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Share Controls - Below the card */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ delay: 0.5 }}
            className="share-controls mt-6 flex flex-col items-center space-y-4"
            onClick={(e) => e.stopPropagation()}
            data-hide-on-capture="true"
          >
            {/* Main Share Button */}
            <motion.button
              onClick={() => setShowShareMenu(!showShareMenu)}
              disabled={isCapturing}
              className={`flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-reddit-orange to-reddit-orange-dark text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-200 ${
                isCapturing ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
              }`}
              whileHover={{ scale: isCapturing ? 1 : 1.05 }}
              whileTap={{ scale: isCapturing ? 1 : 0.95 }}
            >
              {isCapturing ? (
                <>
                  <Camera className="h-5 w-5 animate-pulse" />
                  <span>Capturing HD Image...</span>
                </>
              ) : (
                <>
                  <Share2 className="h-5 w-5" />
                  <span>Share Card</span>
                </>
              )}
            </motion.button>

            {/* Share Menu */}
            <AnimatePresence>
              {showShareMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: -20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -20 }}
                  className="flex flex-wrap items-center justify-center gap-3 p-4 bg-reddit-light-bg dark:bg-reddit-dark-bg-paper rounded-2xl border border-reddit-light-border dark:border-reddit-dark-border shadow-xl backdrop-blur-sm"
                >
                  {/* Capture & Preview Button */}
                  <motion.button
                    onClick={captureCard}
                    disabled={isCapturing}
                    className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Camera className="h-4 w-4" />
                    <span>Preview HD</span>
                  </motion.button>

                  {/* Download Button */}
                  <motion.button
                    onClick={() => downloadImage()}
                    disabled={isCapturing}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Download className="h-4 w-4" />
                    <span>Download</span>
                  </motion.button>

                  {/* Copy to Clipboard */}
                  <motion.button
                    onClick={() => copyToClipboard()}
                    disabled={isCapturing}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 ${
                      copySuccess 
                        ? 'bg-green-600 text-white' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {copySuccess ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span>Copy</span>
                      </>
                    )}
                  </motion.button>

                  {/* Social Media Buttons */}
                  <motion.button
                    onClick={() => shareToSocial('twitter')}
                    disabled={isCapturing}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Twitter className="h-4 w-4" />
                    <span>Twitter</span>
                  </motion.button>

                  <motion.button
                    onClick={() => shareToSocial('facebook')}
                    disabled={isCapturing}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Facebook className="h-4 w-4" />
                    <span>Facebook</span>
                  </motion.button>

                  {/* Native Share (if supported) */}
                  {typeof navigator !== "undefined" && typeof navigator.share === "function" && (
                    <motion.button
                      onClick={() => shareToSocial('native')}
                      disabled={isCapturing}
                      className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Share2 className="h-4 w-4" />
                      <span>Share</span>
                    </motion.button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Instructions */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-white/60 text-sm text-center max-w-md"
            >
              Capture and share your HD Thought Police officer card!
            </motion.p>
          </motion.div>
        </motion.div>
      )}

      {/* HD Image Preview Modal */}
      <AnimatePresence>
        {showImagePreview && capturedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}
            onClick={() => setShowImagePreview(false)}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="relative max-w-4xl w-full bg-reddit-light-bg dark:bg-reddit-dark-bg-paper rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-reddit-light-border dark:border-reddit-dark-border">
                <h3 className="text-lg font-bold text-reddit-light-text dark:text-reddit-dark-text">
                  📸 HD Card Preview
                </h3>
                <button
                  onClick={() => setShowImagePreview(false)}
                  className="p-2 hover:bg-reddit-light-bg-hover dark:hover:bg-reddit-dark-bg-hover rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-reddit-light-text dark:text-reddit-dark-text" />
                </button>
              </div>

              {/* HD Image */}
              <div className="p-6 flex justify-center">
                <div className="relative">
                  <img
                    src={capturedImage}
                    alt="HD Captured card"
                    className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-lg"
                  />
                  <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                    HD Quality
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 border-t border-reddit-light-border dark:border-reddit-dark-border">
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <motion.button
                    onClick={() => downloadImage(capturedImage)}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Download className="h-4 w-4" />
                    <span>Download HD</span>
                  </motion.button>

                  <motion.button
                    onClick={() => copyToClipboard(capturedImage)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      copySuccess 
                        ? 'bg-green-600 text-white' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {copySuccess ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span>Copy to Clipboard</span>
                      </>
                    )}
                  </motion.button>

                  <motion.button
                    onClick={() => shareToSocial('twitter', capturedImage)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Twitter className="h-4 w-4" />
                    <span>Twitter</span>
                  </motion.button>

                  <motion.button
                    onClick={() => shareToSocial('facebook', capturedImage)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-medium transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Facebook className="h-4 w-4" />
                    <span>Facebook</span>
                  </motion.button>

                  {typeof navigator !== "undefined" && typeof navigator.share === "function" && (
                    <motion.button
                      onClick={() => shareToSocial('native', capturedImage)}
                      className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Share2 className="h-4 w-4" />
                      <span>Share</span>
                    </motion.button>
                  )}
                </div>

                <p className="text-center text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary text-sm mt-3">
                  High-definition screenshot ready for sharing on social media
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
};

export default UserProfileCard;