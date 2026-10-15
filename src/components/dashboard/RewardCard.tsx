
"use client";
import { useState, useEffect } from "react";
import RewardVisual from "./RewardVisual";

interface Reward {
    id: string;
    points: number;
    message: string;
}

interface Props {
    rewards: Reward[];
    candidateName: string;
}

export default function RewardCard({ rewards, candidateName }: Props) {
    const [currentReward, setCurrentReward] = useState<Reward | null>(null);

    useEffect(() => {
        if (rewards.length > 0) {
            setCurrentReward(rewards[0]);
        }
    }, [rewards]);

    const handleClose = async () => {
        if (!currentReward) return;

        try {
            await fetch(`/api/rewards/${currentReward.id}/read`, { method: "POST" });
            const nextRewards = rewards.filter(r => r.id !== currentReward.id);
            if (nextRewards.length > 0) {
                setCurrentReward(nextRewards[0]);
            } else {
                setCurrentReward(null);
            }
        } catch (error) {
            console.error(error);
            setCurrentReward(null);
        }
    };

    if (!currentReward) return null;

    return (
        <RewardVisual
            candidateName={candidateName}
            points={currentReward.points}
            message={currentReward.message}
            onClose={handleClose}
        />
    );
}
