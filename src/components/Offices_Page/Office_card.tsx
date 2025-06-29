import React from "react";
import { useEffect, useState } from "react";
import { getAgentsByOfficeId } from "../../Backend_connection/Agent_service/agent_service";
import { Agent } from "../../Backend_connection/types"; // Assuming you have an Agent type defined in your types file

type Props = {
  OfficeID: number;
  OfficeName: string;
  Address: string;
  City: string;
  Province: string;
  PhoneNumber: string;
};

const Office_card = (props: Props) => {
  const [agents, setAgents] = useState<Agent[]>([]);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const agentsData = await getAgentsByOfficeId(props.OfficeID);
        setAgents(agentsData);
      } catch (err) {
        console.log("Failed to fetch agents");
      }
    };

    fetchAgents();
  }, []);

  return (
    <div className="bg-[#262626] flex w-[45vw] h-[30vh] rounded-[0.8rem] my-4">
      <div className="w-[60vw] text-white mx-2 my-1">
        <div className="text-[1.5rem] font-semibold">{props.OfficeName}</div>
        <div className="text-[1.2rem] font-bold">Details:</div>
        <div>{props.Address}</div>
        <div>{props.City}</div>
        <div>{props.Province}</div>
        <div>{props.PhoneNumber}</div>
      </div>
      <div className="border-2 border-white my-4 rounded-lg"></div>
      <div className="my-1">
        <div className="w-[20vw] flex justify-center text-white text-[1.2rem]">
          Affiliated Agents
        </div>
        <div className="text-white mx-3 overflow-y-auto h-[24vh] ">
          {agents.map((agent) => (
            <div key={agent.AgentID} className="agent-card">
              <div className="border-2 border-white transition-all duration-300 ease-in-out  cursor-pointer rounded-lg my-2 flex flex-col items-center hover:bg-[#515151] hover:font-bold">
                <p>{agent.Name}</p>
                <p>{agent.PhoneNumber}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Office_card;
